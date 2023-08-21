import { Axios, Cheerio } from "../Utils"
import { AnoboyBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { AnoboyLatest, AnoboyDetail } from "../Types"
/*
function find(e: Element): { [key: string]: any } {

} */

async function latest (): Promise<AnoboyLatest[] | errorHandling> {
	try {
		const { data } = await Axios.get(AnoboyBaseUrl).catch(
			(e: any) => e?.response
		)
		const $ = Cheerio(data)
		const _temp: any[] = []
		$(".home_index > a[rel='bookmark']").each((i: number, e: Element) => {
			const title: string = $(e).attr("title")
			const update: string = $(e).find(".jamup").text()
			const thumbnail: string =
				AnoboyBaseUrl +
				($(e).find("amp-img").attr("src") || $(e).find("img").attr("src"))
			const url: string = $(e).attr("href")
			_temp.push({ title, update, thumbnail, url })
		})
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error("_temp is not an Array")
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
async function search (query: string): Promise<AnoboyLatest[] | errorHandling> {
	try {
		const { data } = await Axios.get(AnoboyBaseUrl, {
			params: {
				s: query
			}
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		const _temp: any[] = []
		$(".column-content > a[rel='bookmark']").each((i: number, e: Element) => {
			const el: Element = $(e).find(".amv")
			const title: string = $(el).find("h3.ibox1").text().trim()
			const update: string = $(el).find(".jamup").text()
			const thumbnail: string =
				$(e).find("amp-img").attr("src") || $(el).find("img").attr("src")
			const url: string = $(e).attr("href")
			_temp.push({ title, update, thumbnail, url })
		})
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error(`Empty results for ${query}`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
async function detail (url: string): Promise<AnoboyDetail | errorHandling> {
	try {
		const { data } = await Axios.get(url).catch((e: any) => e?.response)
		const $ = Cheerio(data)

		const title: string = $(".pagetitle > h1").text()
		const judi: string = $("#judi > a").attr("href")
		const urls: { source: string; url: string; resolution: string }[] = []
		$(".download")
			.find("p > span")
			.each((i: number, e: Element) => {
				const source: string = $(e).find("span").text()
				$(e)
					.find("a")
					.each((_i: number, _e: Element) => {
						const url: string = $(_e).attr("href")
						const resolution: string = $(_e).text()
						urls.push({ source, url, resolution })
					})
			})
		if (!(Array.isArray(urls) && urls.length)) {
			throw new Error("opps, cant find any urls.")
		}
		return {
			title,
			judi,
			urls
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { latest, search, detail }
