import { Axios, Cheerio } from "../Utils"
import { nhentaiBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { NhentaiSearchResults, NhentaiDetails } from "../Types"

export async function search (
	query: string
): Promise<NhentaiSearchResults[] | errorHandling> {
	if (!query) {
		return {
			error: true,
			message: "No query"
		}
	}
	try {
		const { data } = await Axios.request({
			baseURL: nhentaiBaseUrl,
			url: "/search",
			method: "GET",
			params: {
				q: query
			}
		}).catch((e: any) => e?.response)
		const _temp: any = []
		const $ = Cheerio(data)
		$("div.container > div.gallery").each((i: number, e: Element) => {
			const title: string = $(e).find("a > .caption").text()
			const id = Number(
				$(e)
					.find("a")
					.attr("href")
					.replace(/[^0-9]/g, "")
			)
			// you need to bypass to get access the image from nhentai.to cdn.
			const thumbnail: string = $(e).find("a > img").attr("src")
			_temp.push({
				title,
				id,
				thumbnail
			})
		})
		if (!_temp.length) {
			throw new Error(`Empty result for '${query}'`)
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
	id: number
): Promise<NhentaiDetails | errorHandling> {
	if (!id) {
		return {
			error: true,
			message: "Missing input id" // ww
		}
	}
	try {
		const { data } = await Axios.request({
			baseURL: nhentaiBaseUrl,
			url: "/g/" + id,
			method: "GET"
		}).catch((e) => e?.response)
		if (!data) {
			return {
				error: true,
				message: `Probably id '${id}' not exist`
			}
		}
		const $ = Cheerio(data)

		const title: string = $("div#info > h1").text().trim()
		const images: string[] = []
		$(".thumb-container > a").each((i: number, e: Element) => {
			// you need to bypass to get access the image from nhentai.to cdn.
			const _url: string = $(e)
				.find("img")
				.attr("data-src")
				.replace(/t(\.jpg|\.jpeg|\.png|\.webp|\.gif)$/, "$1")
			images.push(_url)
		})
		if (!title || !images.length) {
			throw new Error(`No title or images found for id ${id}`)
		}
		// i think we should use try catch
		// getting neccesary information about henta*
		const metadata: any = {}
		try {
			const _elementRhapsody = $("section#tags")
			$(_elementRhapsody)
				.find(".tag-container.field-name")
				.each((_i: number, _e: Element) => {
					const tags: string[] = []

					// let say its characters or parodies, etc.
					// and clean up the key that we want
					const _key: string = $(_e).text().trim().split(/\n/)[0].toLowerCase()
					// find value for _key
					$(_e)
						.find(".tag")
						.each((i: number, e: Element) => {
							// time is for uploaded date
							const _tag = $(e).find(".name") || $(e).find("time")
							tags.push(_tag.text())
						})

					// assign to metadata
					// eslint-disable-next-line no-useless-escape
					metadata[_key.replace(/\:.*/g, "")] = tags.join(", ")
				})
		} catch (e: any) {
			metadata.error = String(e)
		}
		return {
			title,
			id,
			metadata,
			images
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
