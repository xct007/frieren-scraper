import { Axios, Cheerio } from "../Utils"
import { ApkmodyIoBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { ApkmodyIoSearchResults, ApkmodyIoDetailResult } from "../Types"
/*
class ApkModyIo {
	private static ()
} */
async function search (
	query: string
): Promise<ApkmodyIoSearchResults[] | errorHandling> {
	try {
		const { data } = await Axios.get(ApkmodyIoBaseUrl + "/", {
			params: {
				s: query
			},
			headers: {
				Referer: ApkmodyIoBaseUrl + "/"
			}
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		const _temp: any[] = []
		$("section > .container > div > div").each((i: number, e: Element) => {
			const title: string = $(e).find(".card-title > .truncate").text().trim()
			const description: string = $(e).find(".card-body > p").text().trim()
			let thumbnail: string = $(e).find(".card-image > img").attr("src")
			let url: string = $(e).find("a").attr("href")
			if (!url.includes(ApkmodyIoBaseUrl)) {
				url = ApkmodyIoBaseUrl + url
			}
			if (!thumbnail.includes("http")) {
				thumbnail = "https://storage.itsrose.my.id/rose.jpeg"
			}
			_temp.push({ title, description, thumbnail, url })
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

/** @warning High memory usage */
async function extractUrl (url: string): Promise<object | boolean> {
	let finalExtractedUrl: object | boolean = false
	try {
		const { data: resp } = await Axios.get(url).catch((e: any) => e?.response)
		const $$ = Cheerio(resp)
		const _extractedUrl: string = $$("a#download-button").attr("href")
		if (/original/i.test(url)) {
			finalExtractedUrl = {}
			Object.assign(finalExtractedUrl, {
				original: _extractedUrl
			})
		}
		if (/mod/i.test(url)) {
			finalExtractedUrl = {}
			Object.assign(finalExtractedUrl, {
				mod: _extractedUrl
			})
		}
	} finally {
		// eslint-disable-next-line no-unsafe-finally
		return finalExtractedUrl
	}
}
async function extractDownloadUrl (
	realDownloadUrl: string
): Promise<any /* { [key: string]: any } | boolean */> {
	const { data } = await Axios.get(realDownloadUrl).catch(
		(e: any) => e?.response
	)
	const $ = Cheerio(data)
	const urls: any[] = []
	$("div.download-list > a").each((i: number, e: Element) => {
		const _urlHref: string = $(e).attr("href")
		if (!/http?s:\/\/worker/i.test(_urlHref)) {
			urls.push(_urlHref)
		}
	})
	if (Array.isArray(urls) && urls.length) {
		const finalExtracted: { [key: string]: any } = {}
		for (const url of urls) {
			const _extracted: { [key: string]: any } | boolean = await extractUrl(
				url
			)
			if (_extracted && typeof _extracted === "object") {
				Object.assign(finalExtracted, { ..._extracted })
			}
		}
		return finalExtracted
	} else {
		return false
	}
}
async function detail (
	url: string
): Promise<ApkmodyIoDetailResult | errorHandling> {
	if (!url.includes(ApkmodyIoBaseUrl)) {
		return {
			error: true,
			message: "Please provide valid apkmody.io URL!"
		}
	}
	try {
		const { data } = await Axios.get(url).catch((e: any) => e?.response)
		const $ = Cheerio(data)

		const title: string = $(".app-name > div > h1")
			.text()
			.replace(/[\t\n]/g, "")
			.trim()
		const updated: string = $(".app-name > div > span > time").text().trim()
		let realDownloadUrl: string = url + "download"
		if (!url.endsWith("/")) {
			realDownloadUrl = url + "/download"
		} else {
			$("section.container > div > div.wp-block-buttons > div").each(
				(i: number, e: Element) => {
					const _urlHref: string = $(e).find("a").attr("href")
					if (/\/games\/|apps\//i.test(_urlHref)) {
						realDownloadUrl = _urlHref
					}
				}
			)
		}
		const _extractedUrl: { [key: string]: any } | boolean =
			await extractDownloadUrl(realDownloadUrl).catch(() => false)
		if (typeof _extractedUrl === "boolean") {
			throw new Error(`Failed to extract direct url from ${realDownloadUrl}`)
		}
		const metadata: { [key: string]: any } = {}
		$("table > tbody > tr").each((i: number, e: Element) => {
			const _key: string = $(e)
				.find("th")
				.text()
				.replace(/\s/g, "_")
				.toLowerCase()
				.trim()
			let _value: string =
				$(e).find("td > a").attr("href") || $(e).find("td").text().trim()
			if (_key && _key.length && _value && _value.length) {
				if (
					/\/apps\/|\/games\/|\/publisher\//.test(_value) &&
					!/\/play.google.com\//.test(_value)
				) {
					_value = ApkmodyIoBaseUrl + _value
				}
				Object.assign(metadata, {
					[_key]: _value
				})
			}
		})
		return {
			title,
			updated,
			metadata,
			urls: _extractedUrl
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { search, detail }
