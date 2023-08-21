import { Axios, Cheerio } from "../Utils"
import { BokepSinBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { BokepSinLatestSearchResults, BokepSinDetail } from "../Types"

async function latest (): Promise<
	BokepSinLatestSearchResults[] | errorHandling
	> {
	try {
		const { data } = await Axios.get(BokepSinBaseUrl).catch(
			(e: any) => e?.response
		)
		const $ = Cheerio(data)
		const _temp: any[] = []
		$("#content > div > div > div > div > div > div").each(
			(i: number, e: Element) => {
				const title: string = $(e).find("a.thumb").attr("title")
				const views: string = $(e).find("span.views-number").text().trim()
				const duration: string = $(e).find("span.duration").text().trim()
				const url: string = $(e).find("a.thumb").attr("href")
				const thumbnail: string = $(e).find("a.thumb > img").attr("data-src")
				_temp.push({ title, views, duration, url, thumbnail })
			}
		)
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error("Results is not an array")
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
async function search (
	query: string
): Promise<BokepSinLatestSearchResults[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			baseURL: BokepSinBaseUrl,
			url: `/search/${query}`
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		const _temp: any[] = []
		$("div.row.no-gutters > div").each((i: number, e: Element) => {
			const title: string = $(e).find("a.thumb").attr("title")
			const views: string = $(e).find("span.views-number").text().trim()
			const duration: string = $(e).find("span.duration").text().trim()
			const url: string = $(e).find("a.thumb").attr("href")
			const thumbnail: string = $(e).find("a.thumb > img").attr("data-src")
			_temp.push({ title, views, duration, url, thumbnail })
		})
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error("Results is not an array")
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}

async function detail (url: string): Promise<BokepSinDetail | errorHandling> {
	if (!url.includes(BokepSinBaseUrl)) {
		return {
			error: true,
			message: `Invalid ${BokepSinBaseUrl} base url`
		}
	}
	try {
		const { data } = await Axios.get(url).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		const views: string = $(".single-video-infos")
			.find(".views-number")
			.text()
			.trim()
		const index = $(".video-player")
		const title: string = $(index)
			.find("meta[itemprop='name']")
			.attr("content")
		const duration: string = $(index)
			.find("meta[itemprop='duration']")
			.attr("content")
			.replace(/[^DHMS\0-9]/g, "")
		const thumbnail: string = $(index)
			.find("meta[itemprop='thumbnailUrl']")
			.attr("content")
		const embed: string = $(index)
			.find("meta[itemprop='embedURL']")
			.attr("content")
		return {
			title,
			views,
			duration,
			thumbnail,
			embed
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { latest, search, detail }
