import { Axios, Cheerio } from "../Utils"
import { errorHandling } from "../Interface"
import { nineAppsBaseUrl } from "../Constant"
import { nineAppSearchResults, nineAppDetailsResults } from "../Types"

export async function search (
	query: string
): Promise<nineAppSearchResults[] | errorHandling> {
	if (!query) {
		return {
			error: true,
			message: "what you want to search?"
		}
	}
	try {
		const { data } = await Axios.request({
			baseURL: nineAppsBaseUrl,
			url: "/search/tag-" + query + "-1/"
		}).catch((e: any) => e?.response)
		if (!data) {
			throw new Error("No data found!")
		}
		const $ = Cheerio(data)
		const _temp: any[] = []
		$("div.content > ul > li[class=\"\"]").each((i: number, e: Element) => {
			const title: string = $(e).find(".name").text().trim()
			let url: string = $(e).find("a.app-item").attr("href")
			if (!url.startsWith("http")) {
				url = nineAppsBaseUrl + url
			}
			const thumbnail: string = $(e).find(".pic > img").attr("src")
			const size: string = $(e).find("p.other > .size").text()
			const version: string = $(e).find("p.other > .version").text()
			_temp.push({
				title,
				url,
				thumbnail,
				size,
				version
			})
		})
		if (!_temp.length) {
			throw new Error(`Empty results for ${query}`)
		}
		return _temp
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}

async function findDownloaUrl (opts: {
	[key: string]: any;
}): Promise<string | boolean> {
	const { data } = await Axios.request({
		...opts
	}).catch((e: any) => e?.response)
	const $ = Cheerio(data)
	const downloadUrl: string | boolean =
		$(".downloading-info").find("a.js_test").attr("href") || false
	return downloadUrl
}
export async function detail (
	url: string
): Promise<nineAppDetailsResults | errorHandling> {
	if (!url.startsWith("http")) {
		return {
			error: true,
			message: "No url provided"
		}
	}
	try {
		const { data, headers } = await Axios.request({
			url
		}).catch((e: any) => e?.response)
		if (!data) {
			throw new Error("No data found!")
		}
		const $ = Cheerio(data)
		const title: string = $("h1.name").text().trim()
		if (!title) {
			throw new Error("Cannot find title sources!")
		}
		const version: string = $(".details-sdk > span[itemprop='version']")
			.text()
			.trim()
		const rating: string = $(".rating-info > .rating").text().trim()
		const size: string =
			$("a.download-app")
				.text()
				.trim()
				.match(/(\d+(\.\d+)?([KMGTPE]B))/i)[0] || ""
		const publisher: string = $(
			".details-author > p[itemprop='publisher']"
		).text()
		const _downloadUrl: string = $("a.download-app").attr("href")
		if (!_downloadUrl) {
			throw new Error("Cannot find base download url sources!")
		}
		const downloadUrl: string | boolean = await findDownloaUrl({
			url: nineAppsBaseUrl + _downloadUrl,
			headers: {
				cookie: headers["set-cookie"]
			}
		})
		if (!downloadUrl) {
			throw new Error("Cannot find direct download url sources!")
		}
		return {
			title,
			version,
			rating,
			size,
			publisher,
			downloadUrl
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
