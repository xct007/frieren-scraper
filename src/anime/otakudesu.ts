import { Cheerio, Axios } from "../Utils"
import { OtakudesuBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { OtakudesuLatest, OtakudesuSearch, OtakudesuDetail } from "../Types"

export async function latest (): Promise<OtakudesuLatest[] | errorHandling> {
	try {
		const { data } = await Axios.get(OtakudesuBaseUrl + "/ongoing-anime").catch(
			(e: any) => e?.response
		)
		const $ = Cheerio(data)
		const _temp: any[] = []
		$(".venz > ul > li").each((i: number, e: Element) => {
			const title: string = $(e).find("h2.jdlflm").text()
			const day: string = $(e).find(".epztipe").text().trim()
			const date: string = $(e).find(".newnime").text().trim()
			const url: string = $(e).find(".thumb > a").attr("href")
			const thumbnail: string = $(e).find(".thumbz > img").attr("src")
			_temp.push({ title, day, date, url, thumbnail })
		})
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error("_temp is not an Array")
		}
	} catch (e: any) {
		return {
			error: true,
			message: e?.TypeError || String(e)
		}
	}
}
export async function search (
	query: string
): Promise<OtakudesuSearch[] | errorHandling> {
	try {
		const { data } = await Axios.get(OtakudesuBaseUrl, {
			params: {
				s: query,
				post_type: "anime"
			}
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		const _temp: any = []
		$(".venutama > .page > ul > li").each((i: number, e: Element) => {
			const title: string = $(e).find("h2").text().trim()
			const url: string = $(e).find("h2 > a").attr("href")
			const _set: string[] = []
			$(e)
				.find(".set")
				.each((_i: number, _e: any) => {
					_set.push($(_e).text())
				})
			const _metadata: any = {}
			_set.forEach((v: string) => {
				const [a, b] = v.split(":")
				Object.assign(_metadata, {
					[a.toLowerCase().trim()]: b.trim()
				})
			})
			const thumbnail: string = $(e).find("img").attr("src")
			_temp.push({ title, ..._metadata, url, thumbnail })
		})
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error(`${query} probably not found`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: e?.TypeError || String(e)
		}
	}
}
export async function detail (
	url: string
): Promise<OtakudesuDetail | errorHandling> {
	try {
		const { data } = await Axios.get(url).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		if (/\/anime\//i.test(url)) {
			const Info: any = {}
			$(".infozingle > p").each((i: number, e: Element) => {
				Info[$(e).text().split(": ")[0].toLowerCase().replace(" ", "_")] = $(e)
					.text()
					.split(": ")[1]
			})
			const thumbnail: string = $(".fotoanime > img").attr("src")
			const sinopsis: string[] = []
			$(".sinopc > p").each((i: number, e: Element) => {
				sinopsis.push($(e).text())
			})
			const hasEps: { title: string; url: string }[] | any[] = []
			let hasBatch: string | boolean = false
			$(".episodelist")
				.find("a")
				.each((i: number, e: Element) => {
					const _url: string = $(e).attr("href")
					if (/\/batch\//i.test(_url)) {
						hasBatch = _url
					}
				})
			$("#venkonten > div.venser > div.episodelist:nth-child(8)")
				.find("a")
				.each((i: number, e: Element) => {
					hasEps.push({
						title: $(e).text(),
						url: $(e).attr("href")
					})
				})
			return {
				isAnime: true,
				...Info,
				thumbnail,
				sinopsis: sinopsis.join("\n"),
				url: {
					batch: hasBatch,
					episodes: [...hasEps]
				}
			}
		} else if (/\/batch\//i.test(url)) {
			const title: string = $(".jdlrx > h1").text()
			const thumbnail: string = $(".imganime").find("img").attr("src")
			const episode: string = $(".totalepisode > .total").text()
			const urls: any = {}
			$("div.batchlink > ul > li").each((i: number, e: Element) => {
				const resolution: string | any = $(e)
					.find("strong")
					.text()
					.replace(/MP4|MKV/g, "")
					.trim()
				$(e)
					.find("a")
					.each((_i: number, _e: Element) => {
						urls[resolution] = urls[resolution] ? urls[resolution] : []
						urls[resolution].push({
							source: $(_e).text(),
							url: $(_e).attr("href")
						})
					})
			})
			return {
				isBatch: true,
				title,
				episode,
				thumbnail,
				urls
			}
		} else if (/\/episode\//i.test(url)) {
			const info: string[] = []
			let metadata: any = {}
			$(".infozingle > p").each((i: number, e: Element) => {
				info.push($(e).text().split(": "))
			})
			metadata = info.reduce((final: any, [key, value]) => {
				final[key.toLowerCase()] = value
				return final
			}, {})
			const urls: any = {}
			$("div.download > ul > li").each((i: number, e: Element) => {
				const resolution: string | any = $(e)
					.find("strong")
					.text()
					.replace(/MP4|MKV/gi, "")
					.trim()
				$(e)
					.find("a")
					.each((_i: number, _e: Element) => {
						urls[resolution] = urls[resolution] ? urls[resolution] : []
						urls[resolution].push({
							source: $(_e).text(),
							url: $(_e).attr("href")
						})
					})
			})
			return {
				isEpisode: true,
				title: $(".download > h4").text(),
				metadata,
				urls
			}
		} else {
			throw new Error("Url mismatch ?")
		}
	} catch (e: any) {
		return {
			error: true,
			message: e?.TypeError || String(e)
		}
	}
}
