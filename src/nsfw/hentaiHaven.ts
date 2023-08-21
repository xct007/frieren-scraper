/* eslint-disable camelcase */
import { Axios, Cheerio } from "../Utils"
import { errorHandling } from "../Interface"
import { hentaiHavenSearchResults, hentaiHavenDetails } from "../Types"
import { hentaiHavenBaseUrl } from "../Constant"

export async function search (
	query: string
): Promise<hentaiHavenSearchResults[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			baseURL: hentaiHavenBaseUrl,
			method: "GET",
			url: "/",
			params: {
				s: query,
				post_type: "wp-manga"
			}
		}).catch((e: any) => e?.response)
		if (!data) {
			throw new Error(`Failed to fetch data from ${hentaiHavenBaseUrl}`)
		}
		const $ = Cheerio(data)
		const _temp: hentaiHavenSearchResults[] = []
		$("div[role='tabpanel'] > div").each((i: number, e: Element) => {
			const title: string = $(e).find("a").attr("title")
			const url: string = $(e).find("a").attr("href")
			const thumbnail: string = $(e).find("a > img").attr("src")

			const _metadatas: { [key: string]: string }[] = []
			const _metadata = $(e).find(".post-content > div")
			$(_metadata).each((_i: number, _e: Element) => {
				const _sum_title: string = $(_e)
					.find(".summary-heading")
					.text()
					.trim()
					.toLowerCase()
				const _sum_content: string = $(_e)
					.find(".summary-content")
					.text()
					.trim()
				_metadatas.push({
					[_sum_title]: _sum_content
				})
			})
			const metadata = Object.assign({}, ..._metadatas)
			_temp.push({
				title,
				thumbnail,
				url,
				metadata
			})
		})
		if (!_temp.length) {
			throw new Error(`Empty results "${query}"`)
		}
		return _temp
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}

// Find HLS video source from iframe;
async function findHLSources (
	url: string,
	cookie: string
): Promise<{
	type?: string;
	url?: string;
	error?: string;
}> {
	try {
		const { data: _data } = await Axios.request({
			method: "GET",
			url
		}).catch((e: any) => e?.response)
		const $ = Cheerio(_data)

		const scripts: string = $("body > script[type='text/javascript']").text()
		if (!scripts) {
			throw new Error("failed to find sources")
		}
		// eslint-disable-next-line no-useless-escape
		const en = scripts.match(/var en = \"(.*)\";/)?.[1]
		// eslint-disable-next-line no-useless-escape
		const iv = scripts.match(/var iv = \"(.*)\";/)?.[1]
		const form = new FormData()
		form.append("action", "zarat_get_data_player_ajax")
		form.append("a", String(en))
		form.append("b", String(iv))
		const { data } = await Axios.request({
			baseURL: hentaiHavenBaseUrl,
			url: "/wp-content/plugins/player-logic/api.php",
			method: "POST",
			headers: {
				cookie
			},
			data: form
		}).catch((e: any) => e?.response)
		if (!data || !data.status || !(data.data && data.data.sources)) {
			throw new Error("failed to find HLS video sources")
		}
		return {
			type: data.data.sources[0].type,
			url: data.data.sources[0].src
		}
	} catch (e: any) {
		return {
			error: String(e)
		}
	}
}

export async function detail (
	url: string
): Promise<hentaiHavenDetails | errorHandling> {
	try {
		const { data, headers } = await Axios.request({
			method: "GET",
			url
		}).catch((e: any) => e?.response)
		if (!data) {
			throw new Error(`Failed to get data from ${url}`)
		}
		const $ = Cheerio(data)
		const title: string =
			$(".post-title > h1").text().trim() ||
			$("#chapter-heading.h4").text().trim()

		// throw error if no title found
		if (!title) {
			throw new Error("Cannot find title sources")
		}
		const thumbnail: string = $("a > img").attr("src")

		if (url.includes("episode-")) {
			const _iframe_source_url: string = $(".player_logic_item > iframe").attr(
				"src"
			)
			const synopsis: string = $(".description-summary")
				.find("p")
				.text()
				.replace(/synopsis:/i, "")
				.trim()
			// FFS :)
			const source: {
				type?: string;
				url?: string;
				error?: string;
			} = await findHLSources(_iframe_source_url, headers["set-cookie"])
			if (source.error) {
				throw new Error(source.error)
			}
			return {
				isEpisode: true,
				title,
				thumbnail,
				synopsis,
				source
			}
		}
		const _metadatas: { [key: string]: string }[] = []
		const episodes: {
			episode: string;
			release_date: string;
			url: string;
		}[] = []
		$(".post-content > div").each((i: number, e: Element) => {
			const _sum_title: string = $(e)
				.find(".summary-heading")
				.text()
				.trim()
				.toLowerCase()
				.replace(/[^\w+]/g, "")
			const _sum_content: string = $(e).find(".summary-content").text().trim()
			if (_sum_title && _sum_content) {
				_metadatas.push({
					[_sum_title]: _sum_content
				})
			}
		})
		$(".listing-chapters_wrap > ul > li").each((i: number, e: Element) => {
			const episode: string = $(e).find("a").text().trim()
			const release_date: string = $(e)
				.find(".chapter-release-date > i")
				.text()
			const url: string = $(e).find("a").attr("href")
			episodes.push({
				episode,
				release_date,
				url
			})
		})
		const metadata = Object.assign({}, ..._metadatas)
		return {
			isEpisode: false,
			title,
			thumbnail,
			metadata,
			episodes
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
