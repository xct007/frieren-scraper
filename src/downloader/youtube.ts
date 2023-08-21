import { Axios, Cheerio } from "../Utils"
import { YoutubeSearchBaseUrl, YoutubeDownloadBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { YoutubeSearchResult, YoutubeDownloadResult } from "../Types"

async function search (
	query: string
): Promise<YoutubeSearchResult[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			baseURL: YoutubeSearchBaseUrl,
			url: "/results",
			params: {
				search_query: query
			}
		}).catch((e: any) => e?.response)
		const $ = Cheerio(data)
		let _string = ""
		$("script").each((i: number, e: any) => {
			if (/var ytInitialData = /gi.exec($(e).html())) {
				_string += $(e)
					.html()
					.replace(/var ytInitialData = /i, "")
					.replace(/;$/, "")
			}
		})
		const _initData =
			JSON.parse(_string).contents.twoColumnSearchResultsRenderer
				.primaryContents

		const Results: any[] = []
		let _render = null
		if (_initData.sectionListRenderer) {
			_render = _initData.sectionListRenderer.contents
				.filter((item: any) =>
					item?.itemSectionRenderer?.contents.filter(
						(v: any) =>
							v.videoRenderer || v.playlistRenderer || v.channelRenderer
					)
				)
				.shift().itemSectionRenderer.contents
		}
		if (_initData.richGridRenderer) {
			_render = _initData.richGridRenderer.contents
				.filter(
					(item: any) => item.richGridRenderer && item.richGridRenderer.contents
				)
				.map((item: any) => item.richGridRenderer.contents)
		}
		for (const item of _render) {
			if (item.videoRenderer && item.videoRenderer.lengthText) {
				const video = item.videoRenderer
				const title: string = video?.title?.runs[0]?.text || ""
				const duration: string = video?.lengthText?.simpleText || ""
				const thumbnail: string =
					video?.thumbnail?.thumbnails[video?.thumbnail?.thumbnails.length - 1]
						.url || ""
				const uploaded: string = video?.publishedTimeText?.simpleText || ""
				const views: string =
					video?.viewCountText?.simpleText?.replace(/[^0-9.]/g, "") || ""
				if (title && thumbnail && duration && uploaded && views) {
					Results.push({
						title,
						thumbnail,
						duration,
						uploaded,
						views,
						url: "https://www.youtube.com/watch?v=" + video.videoId
					})
				}
			}
		}
		return Results
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
async function download (
	url: string
): Promise<YoutubeDownloadResult | errorHandling> {
	try {
		const { data } = await Axios.request({
			baseURL: YoutubeDownloadBaseUrl,
			url: "/ytdl/v2/youtube/video_info",
			method: "POST",
			data: {
				url
			}
		}).catch((e: any) => e?.response)
		if (data.cscode !== 200) {
			throw new Error("API response code " + data.cscode || "unknown")
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { result } = data.data;
		const urls: { url: string; quality: string; ext: string }[] = []
		for (const obj of result.videos) {
			urls.push({
				url: obj.url,
				quality: obj.quality,
				ext: obj.type
			});
		}
		return {
			title: result.meta.title,
			duration: result.meta.length_seconds,
			thumbnail: result.meta.thumbnail.url,
			urls,
			mp3: isNaN(result.convert_to_mp3) ? result.convert_to_mp3 : ""
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { search, download }
