import https from "https"
import { Axios, Cheerio } from "../Utils"
import { PinterestDownloadBaseUrls } from "../Constant"
import { errorHandling } from "../Interface"
import { PinterestDownloadResult } from "../Types"

class Pinterest {
	private static async CreateRequest (
		baseUrl: string,
		config?: { [key: string]: any }
	): Promise<any> {
		return Axios.request({ url: baseUrl, ...config }).catch(
			(e: any) => e?.response
		)
	}

	private static async v1GetToken (): Promise<
		{ token: string; cookie: string } | boolean
		> {
		const { data, headers } = await Pinterest.CreateRequest(
			PinterestDownloadBaseUrls.v1,
			{ httpsAgent: new https.Agent({ keepAlive: true }) }
		)
		const $ = Cheerio(data)
		const token: string =
			$("#downloadForm > input[name='token']").attr("value") || ""
		const cookie: string = headers["set-cookie"] || ""
		if (token && cookie) {
			return { token, cookie }
		} else {
			return false
		}
	}

	public static async v1 (
		pinUrl: string
	): Promise<PinterestDownloadResult | errorHandling> {
		try {
			const prepare = await Pinterest.v1GetToken()
			if (typeof prepare !== "object") {
				throw new Error(
					`Failed to retrieve token from ${PinterestDownloadBaseUrls.v1}`
				)
			}
			const data = await Pinterest.CreateRequest(
				PinterestDownloadBaseUrls.v1 + "/downloader.php",
				{
					method: "POST",
					headers: {
						Cookie: prepare.cookie
					},
					withCredentials: true,
					data: new URLSearchParams({ url: pinUrl, token: prepare.token })
				}
			)
			const $ = Cheerio(data.data)
			const url: string = $("a.downloadBtn").attr("href")
			if (url) {
				return { url }
			} else {
				throw new Error(
					"Failed to find imagge/video/gif source, is that valid Pinterest URL ?"
				)
			}
		} catch (e: any) {
			return {
				error: true,
				message: String(e)
			}
		}
	}

	public static async download (
		url: string
	): Promise<PinterestDownloadResult | errorHandling> {
		const _ = await this.v1(url);
		return _
	}
}
export const pinterest = async (url: string) => Pinterest.download(url)
