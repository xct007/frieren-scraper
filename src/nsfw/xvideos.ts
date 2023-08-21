import { Axios, Cheerio } from "../Utils"
import { errorHandling } from "../Interface"
import { XvideosBaseUrl } from "../Constant"
import { XvideosSearchResults, XvideosDetailsResults } from "../Types"

export async function search (
	query: string
): Promise<XvideosSearchResults[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			baseURL: XvideosBaseUrl,
			url: "/",
			method: "GET",
			params: {
				k: query
			}
		}).catch((e: any) => e?.response)
		if (!data) {
			throw new Error(`No data response from ${XvideosBaseUrl}`)
		}
		const $ = Cheerio(data)
		const _temp: any[] = []
		$("#content > div > div").each((i: number, e: Element) => {
			const title: string = $(e).find("p.title > a").attr("title")
			let url: string = $(e).find("p.title > a").attr("href")
			if (!url.startsWith("http")) {
				url = XvideosBaseUrl + url
			}
			const quality: string = $(e).find(".video-hd-mark").text() || "low"
			// /[^0-9\.K|M]/gi
			const views: string = $(e)
				.find(".bg > span > span")
				.text()
				// eslint-disable-next-line no-useless-escape
				.replace(/[^0-9\.K|M]/gi, "")
			const duration: string = $(e).find("a > .duration").text()
			const thumbnail: string = $(e).find(".thumb > a > img").attr("data-src")
			_temp.push({
				title,
				quality,
				views,
				duration,
				url,
				thumbnail
			})
		})
		if (!(Array.isArray(_temp) && _temp.length)) {
			throw new Error(`Empty results for '${query}'`)
		}
		return _temp
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export async function detail (
	url: string
): Promise<XvideosDetailsResults | errorHandling> {
	try {
		const { data } = await Axios.request({
			url,
			method: "GET"
		}).catch((e: any) => e?.response)
		if (!data) {
			throw new Error("No data found for the provided url.")
		}
		const $ = Cheerio(data)
		const duration: string = $("h2.page-title > .duration").text()
		const quality: string = $("h2.page-title > .video-hd-mark").text() || "low"
		if (!duration) {
			throw new Error("is that correct xvideos url?")
		}
		let scripts = ""
		$("script").each((i: number, e: Element) => {
			scripts += $(e).text()
		})
		/**
		 * @p RegExp pattern.
		 */
		const titleRegExp = /setVideoTitle\('(.+?)'\)/
		const lowRegExp = /setVideoUrlLow\('(.+?)'\)/
		const highRegExp = /setVideoUrlHigh\('(.+?)'\)/
		const hlsRegExp = /setVideoHLS\('(.+?)'\)/

		// whatever.
		const results: XvideosDetailsResults = {
			title: "",
			quality: "",
			duration: "",
			urls: {}
		}
		const title = scripts.match(titleRegExp)
		const low = scripts.match(lowRegExp)
		const high = scripts.match(highRegExp)
		const hls = scripts.match(hlsRegExp)
		if (title && title[1]) {
			results.title = title[1]
		} else {
			throw new Error("cannot find title sources!")
		}
		results.quality = quality
		results.duration = duration
		if (low && low[1]) {
			results.urls.low = low[1]
		}
		if (high && high[1]) {
			results.urls.high = high[1]
		}
		if (hls && hls[1]) {
			results.urls.hls = hls[1]
		}
		if (!(results.urls.low || results.urls.high)) {
			throw new Error("cannot find video sources!")
		}
		return results
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
