/**
 * Reference:
 * @link {https://github.com/superXdev/zippyshare-downloader/blob/main/utils/url.js}
 */
import https from "https"
import { Axios, Cheerio } from "../Utils"
import { errorHandling } from "../Interface"
import { ZippyShareResult } from "../Types"

function isValidUrl (url: string): boolean {
	return /(https?:\/\/(.+?\.)?zippyshare\.com(\/[A-Za-z0-9\-\\._~:\\/\\?#\\[\]@!$&'\\(\\)\\*\\+,;\\=]*)?)/gm.test(
		url
	)
}
async function download (
	url: string
): Promise<ZippyShareResult | errorHandling> {
	if (!isValidUrl(url)) {
		return {
			error: true,
			message: "Invalid URL!"
		}
	}
	try {
		const { data } = await Axios.get(url, {
			httpsAgent: new https.Agent({ keepAlive: true })
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)

		// Extract url from raw data
		const splitUrl: string[] = url.split("/")
		const Regex = /(?<=dlbutton)(.*)(?=;)/gm
		const _match = data.match(Regex)[0].replace("').href = ", "")
		// eslint-disable-next-line no-eval
		const finalUrl = `${splitUrl[0]}//${splitUrl[2]}${eval(_match)}`

		// Attempt to parse raw data.
		const _temp: any[] = []
		$("div#lrbox > div.center > div > font").each((i: number, e: Element) => {
			const _rawText: string = $(e).text()
			// LOL
			if (_rawText !== "You have requested the file:") {
				_temp.push(_rawText.replace(/:/, ""))
			}
		})
		const metadata: { [key: string]: any } = {}
		_temp.forEach((e: string, i: number) => {
			if (i % 2 === 0) {
				Object.assign(metadata, {
					[e.toLowerCase().trim()]: _temp[i + 1]
				})
			}
		})
		return {
			...metadata,
			url: finalUrl
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { download }
