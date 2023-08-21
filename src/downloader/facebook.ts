import { Axios, Cheerio } from "../Utils"
import { FacebookDownloadBaseUrls } from "../Constant"
import { errorHandling } from "../Interface"
import { FacebookDownloadResult } from "../Types"

async function v1 (
	url: string
): Promise<FacebookDownloadResult | errorHandling> {
	try {
		const { data } = await Axios.request({
			url: FacebookDownloadBaseUrls.v1 + "/process",
			method: "POST",
			headers: {
				accept: "*/*",
				"accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
				"cache-control": "no-cache",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"hx-current-url": FacebookDownloadBaseUrls.v1 + "/",
				"hx-request": "true",
				"hx-target": "target",
				"hx-trigger": "form",
				pragma: "no-cache",
				Referer: FacebookDownloadBaseUrls.v1 + "/",
				"Referrer-Policy": "strict-origin-when-cross-origin"
			},
			data: new URLSearchParams({
				id: decodeURIComponent(url),
				locale: "en"
			})
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		const title: string = $(".results-item-text")
			.text()
			.replace(/\s{2,}/g, "")
			.replace(/[\t\n]/g, "")
		const _temp: any[] = []
		$(".results-download > ul > li").each((i: number, e: Element) => {
			const _rawType = $(e).find("a").attr("download")
			const _url = $(e).find("a").attr("href")
			if (/sd/i.test(_rawType)) {
				_temp.push({ sd: _url })
			}
			if (/hd/i.test(_rawType)) {
				_temp.push({ hd: _url })
			}
		})
		if (Array.isArray(_temp) && _temp.length) {
			let isHdAvailable = false
			_temp.forEach((v: { [key: string]: any }) => {
				if (v.hd) {
					isHdAvailable = true
				}
			})
			return { title, isHdAvailable, urls: _temp }
		} else {
			throw new Error("Empty video urls source!")
		}
	} catch (e: any) {
		return { error: true, message: String(e) }
	}
}
export const facebook = async (url: string) => v1(url)
