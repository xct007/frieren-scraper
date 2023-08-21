import { Axios, Cheerio } from "../Utils"
import { DanbooruBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"

async function getUrlSearchQuery (
	query: string
): Promise<string[] | errorHandling> {
	try {
		const { data } = await Axios.get(DanbooruBaseUrl + "/posts", {
			params: {
				tags: query,
				z: "10"
			}
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		const _temp: any[] = []
		$("#posts > div > div > article").each((i: number, e: Element) => {
			const sourcePreviewUrl: string = $(e).find("a.post-preview-link").attr("href")
			_temp.push(DanbooruBaseUrl + sourcePreviewUrl)
		})
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error(`Failed to fetch data, query: ${query}`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
async function search (query: string): Promise<any | errorHandling> {
	const ArrayUrlResult = await getUrlSearchQuery(query)
	if (!Array.isArray(ArrayUrlResult) || !ArrayUrlResult.length) {
		return {
			error: true,
			message: `probably not found "${query}"`
		}
	}
	try {
		const _temp: any[] = []
		for (const i of ArrayUrlResult) {
			const { data } = await Axios.get(i).catch((e: any) => e?.response)
			const $ = Cheerio(data)
			const url: string | null =
				$("#post-info-size > a").attr("href") ||
				$("#image-resize-notice > a").attr("href") ||
				$(".image-container > picture > source").attr("srcset") ||
				null
			const _tempData: any[] = []
			const metadata: { [key: string]: any } = {}
			if (url !== null) {
				const _Temp: any[] = []
				$("#post-information > ul > li").each((_i: number, e: Element) => {
					const _rawText = $(e)
						.text()
						.replace(/[\t\n]/g, "")
						.trim()
					_Temp.push(..._rawText.split(":"))
					if (_Temp.length === 2) {
						_tempData.push(..._Temp)
						_Temp.splice(0, _Temp.length)
					}
				})
				_tempData.forEach((e: string, i: number) => {
					if (i % 2 === 0) {
						Object.assign(metadata, {
							[e.replace(/\s/g, "_").toLowerCase().trim()]: _tempData[i + 1]
								.replace("»", "")
								.replace(/\s{2,}/g, "")
								.trim()
						})
					}
				})
				Object.assign(metadata, {
					url
				})
				_temp.push({ ...metadata })
			}
		}
		if (Array.isArray(_temp) && _temp.length) {
			return _temp
		} else {
			throw new Error(`Failed to fetch data, query: ${query}`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { search }
