/* eslint-disable no-self-assign */
/* eslint-disable camelcase */
import { Axios, Cheerio } from "../Utils"
import { KomikuIdBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import {
	KomikuIdLatestResults,
	KomikuIdDetailResult,
	KomikuIdSearchResults
} from "../Types"
// wkwk
class komiku {
	private static _failed = {
		latest: `failed to get latest data from ${KomikuIdBaseUrl}`,
		detail: `failed to get detail data from ${KomikuIdBaseUrl}`,
		search: `failed to get search data from ${KomikuIdBaseUrl}`
	}

	private static _latestLoader = {
		base: "#Terbaru > .ls4w > article.ls4",
		titleLoader: "h4 > a",
		updatedLoader: "span.ls4s",
		chapterLoader: "a.ls24",
		urlLoader: {
			base: "h4 > a",
			attribute: "href"
		},
		thumbnailLoader: {
			base: "a > img",
			attribute: "data-src"
		}
	}

	private static _detailLoader = {
		manga: {
			titleLoader: {
				title: "h1[itemprop='name']"
			},
			descriptionLoader: "p.desc",
			thumbnailLoader: {
				base: ".ims > img",
				attribute: "src"
			},
			metadataLoader: {
				firstChild: "div.new1 > a > span",
				secondChild: "table.inftable > tbody > tr > td"
			},
			genresLoader: {
				base: "ul.genre > li > a"
			},
			chaptersLoader: {
				base: "table#Daftar_Chapter > tbody > tr > td > a",
				chapter: "span",
				url: {
					attribute: "href"
				}
			}
		},
		chapter: {
			titleLoader: {
				title: "#Judul > h1"
			},
			imagesLoader: {
				base: "#Baca_Komik > img",
				attribute: "src"
			}
		}
	}

	private static _searchLoader = {
		base: ".daftar > .bge",
		titleLoader: {
			title: ".kan > a > h3",
			title_id: ".kan span.judul2"
		},
		descriptionLoader: ".kan > p",
		thumbnailLoader: {
			base: ".bgei > a > img",
			attribute: "data-src"
		},
		urlLoader: {
			base: ".bgei > a",
			attribute: "href"
		},
		metadataLoader: ".new1 > a > span"
	}

	// eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
	private constructor () {}
	public static async latest (): Promise<
		KomikuIdLatestResults[] | errorHandling
		> {
		try {
			const { data } = await Axios.get(KomikuIdBaseUrl, {}).catch(
				(e: any) => e?.response
			)
			const $ = Cheerio(data)
			const _temp: any[] = []
			$(komiku._latestLoader.base).each((i: number, e: Element) => {
				const title: string = $(e)
					.find(komiku._latestLoader.titleLoader)
					.text()
				const updated: string = $(e)
					.find(komiku._latestLoader.updatedLoader)
					.text()
				const chapter: string = $(e)
					.find(komiku._latestLoader.chapterLoader)
					.text()
				let url: string = $(e)
					.find(komiku._latestLoader.urlLoader.base)
					.attr(komiku._latestLoader.urlLoader.attribute)
				const thumbnail: string = $(e)
					.find(komiku._latestLoader.thumbnailLoader.base)
					.attr(komiku._latestLoader.thumbnailLoader.attribute)
					.replace(/\?.*$/, "")
				if (url.startsWith("http")) {
					url = url
				} else {
					url = KomikuIdBaseUrl + url
				}
				_temp.push({ title, updated, chapter, url, thumbnail })
			})
			if (Array.isArray(_temp) && _temp.length) {
				return _temp
			} else {
				throw new Error(komiku._failed.latest)
			}
		} catch (e: any) {
			return {
				error: true,
				message: String(e)
			}
		}
	}

	public static async detail (
		url: string
	): Promise<
		| KomikuIdDetailResult["Manga"]
		| KomikuIdDetailResult["Chapter"]
		| errorHandling
	> {
		try {
			if (!url.includes(KomikuIdBaseUrl)) {
				throw new Error("Invalid url dude")
			}
			const { data } = await Axios.get(url).catch((e: any) => e?.response)
			const $ = Cheerio(data)
			if (/\/manga\//i.test(url)) {
				const title: string = $(komiku._detailLoader.manga.titleLoader.title)
					.text()
					.trim()
				const description: string = $(
					komiku._detailLoader.manga.descriptionLoader
				)
					.text()
					.trim()
				const _tempData: string[] = []
				const metadata: { [key: string]: any } = {}
				$(komiku._detailLoader.manga.metadataLoader.firstChild).each(
					(i: number, e: Element) => {
						_tempData.push($(e).text().replace(/:/, "").trim())
					}
				)
				_tempData.forEach((e: string, i: number) => {
					if (i % 2 === 0) {
						Object.assign(metadata, {
							[e.toLowerCase()]: _tempData[i + 1]
						})
					}
				})
				_tempData.splice(0, _tempData.length)
				$(komiku._detailLoader.manga.metadataLoader.secondChild).each(
					(i: number, e: Element) => {
						_tempData.push($(e).text())
					}
				)
				_tempData.forEach((e: string, i: number) => {
					if (i % 2 === 0) {
						Object.assign(metadata, {
							[e.replace(/\s/g, "_").toLowerCase().trim()]: _tempData[i + 1]
						})
					}
				})
				const genres: string[] = []
				$(komiku._detailLoader.manga.genresLoader.base).each(
					(i: number, e: Element) => {
						genres.push($(e).text())
					}
				)
				const chapters: { chapter: string; url: string }[] = []
				$(komiku._detailLoader.manga.chaptersLoader.base).each(
					(i: number, e: Element) => {
						const chapter: string = $(e)
							.find(komiku._detailLoader.manga.chaptersLoader.chapter)
							.text()
						const url: string =
							KomikuIdBaseUrl +
							$(e).attr(
								komiku._detailLoader.manga.chaptersLoader.url.attribute
							)
						chapters.push({ chapter, url })
					}
				)
				return {
					isManga: true,
					title,
					metadata,
					description,
					chapters
				}
			} else if (/\/ch\//i.test(url)) {
				const _title: string[] = []
				$(komiku._detailLoader.chapter.titleLoader.title).each(
					(i: number, e: Element) => {
						_title.push($(e).text())
					}
				)
				const title: string = _title[0].replace(/[\t\n]/g, "").trim()
				const images: string[] = []
				$(komiku._detailLoader.chapter.imagesLoader.base).each(
					(i: any, e: Element) => {
						images.push(
							$(e).attr(komiku._detailLoader.chapter.imagesLoader.attribute)
						)
					}
				)
				return {
					isChapter: true,
					title,
					images
				}
			} else {
				throw new Error(komiku._failed.detail)
			}
		} catch (e: any) {
			return {
				error: true,
				message: String(e)
			}
		}
	}

	public static async search (
		query: string
	): Promise<KomikuIdSearchResults[] | errorHandling> {
		try {
			const { data } = await Axios.get(
				KomikuIdBaseUrl.replace("https://", "https://data.") + "/cari/",
				{
					params: {
						post_type: "manga",
						s: query
					}
				}
			).catch((e: any) => e?.response)
			const $ = Cheerio(data)
			const _temp: any[] = []
			$(komiku._searchLoader.base).each((i: number, e: Element) => {
				const title: string = $(e)
					.find(komiku._searchLoader.titleLoader.title)
					.text()
					.trim()
				const title_id: string = $(e)
					.find(komiku._searchLoader.titleLoader.title_id)
					.text()
					.trim()
				const description: string = $(e)
					.find(komiku._searchLoader.descriptionLoader)
					.text()
					.trim()
				const thumbnail: string = $(e)
					.find(komiku._searchLoader.thumbnailLoader.base)
					.attr(komiku._searchLoader.thumbnailLoader.attribute)
					.replace(/\?.*$/, "")
				const url: string = $(e)
					.find(komiku._searchLoader.urlLoader.base)
					.attr(komiku._searchLoader.urlLoader.attribute)
				const metadata: { [key: string]: any } = {}
				const _tempData: string[] = []
				$(e)
					.find(komiku._searchLoader.metadataLoader)
					.each((_i: number, _e: Element) => {
						_tempData.push($(_e).text().replace(/:/, "").trim())
					})
				_tempData.forEach((e: string, i: number) => {
					if (i % 2 === 0) {
						Object.assign(metadata, {
							[e.replace(/\s/g, "_").toLowerCase().trim()]: _tempData[i + 1]
						})
					}
				})
				_temp.push({
					title,
					title_id,
					...metadata,
					description,
					thumbnail,
					url
				})
			})
			if (Array.isArray(_temp) && _temp.length) {
				return _temp
			} else {
				throw new Error(komiku._failed.search)
			}
		} catch (e: any) {
			return {
				error: true,
				message: String(e)
			}
		}
	}
}
export const latest = async function (): Promise<
	KomikuIdLatestResults[] | errorHandling
	> {
	return await komiku.latest()
}
export const search = async function (
	query: string
): Promise<KomikuIdSearchResults[] | errorHandling> {
	return await komiku.search(query)
}
export const detail = async function (
	url: string
): Promise<
	| KomikuIdDetailResult["Manga"]
	| KomikuIdDetailResult["Chapter"]
	| errorHandling
> {
	return await komiku.detail(url)
}
