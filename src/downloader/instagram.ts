import { Axios, Cheerio } from "../Utils";
import { InstagramDownloadBaseUrl } from "../Constant";
import { errorHandling } from "../Interface";
import { InstagramDownloadResults } from "../Types";

class Instagrams {
	static async v1(
		url: string
	): Promise<InstagramDownloadResults[] | errorHandling> {
		try {
			const { data } = await Axios.request({
				baseURL: InstagramDownloadBaseUrl.v1,
				url: "/wp-admin/admin-ajax.php",
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Upgrade-Insecure-Requests": "1",
					Referer: InstagramDownloadBaseUrl.v1,
					"Referrer-Policy": "strict-origin-when-cross-origin",
				},
				data: new URLSearchParams({ action: "ajax_insta_url", input: url }),
			}).catch((e: any) => e?.response);
			const $ = Cheerio(data);
			const _temp: any[] = [];
			$("script").each((i: number, e: Element) => {
				const text = $(e).html();
				const url = text?.match(/location.href = "(.*?)"/)?.[1];
				if (url) {
					_temp.push({ url });
				}
			});
			if (Array.isArray(_temp) && _temp.length) {
				return _temp;
			} else {
				throw new Error($(".alert-danger").text() || "v1: Failed to retrieve data.");
			}
		} catch (e: any) {
			return {
				error: true,
				message: String(e?.Error || e),
			};
		}
	}

	static async v2(
		url: string
	): Promise<InstagramDownloadResults[] | errorHandling> {
		try {
			const { data: _data, headers } = await Axios.request({
				baseURL: InstagramDownloadBaseUrl.v2,
				method: "GET",
				headers: {
					"User-Agent": "okhttp/4.20.0",
				},
			}).catch((e) => e?.response);
			const _$ = Cheerio(_data);
			const _opts = {
				referer: _$("input[name='referer']").attr("value"),
				locale: _$("input[name='locale']").attr("value"),
				_token: _$("input[name='_token']").attr("value"),
				link: url,
			};
			const { data } = await Axios.request({
				baseURL: InstagramDownloadBaseUrl.v2,
				url: "/download",
				method: "POST",
				headers: {
					"User-Agent": "okhttp/4.20.0",
					cookie: headers["set-cookie"],
				},
				data: new URLSearchParams({ ..._opts }),
			}).catch((e) => e?.response);
			const $ = Cheerio(data);
			const _temp: any[] = [];
			$("#result")
				.find("a[target='_blank']")
				.each((i: number, e: Element) => {
					const url = $(e).attr("href");
					_temp.push({ url });
				});
			if (_temp.length) {
				return _temp;
			} else {
				throw new Error("Probably wrong url or private post/reel");
			}
		} catch (e) {
			return {
				error: true,
				message: String(e),
			};
		}
	}

	public static async download(
		url: string
	): Promise<InstagramDownloadResults[] | errorHandling> {
		let _: InstagramDownloadResults[] | errorHandling = await this.v1(url);
		if ("error" in _) {
			_ = await this.v2(url);
		}
		return _;
	}
}
export const instagram = async (url: string) => Instagrams.download(url);
