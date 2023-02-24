import { Axios, Cheerio } from "../Utils";
import { YoutubeSearchBaseUrl, YoutubeDownloadBaseUrl } from "../Constant";
import {
	YoutubeSearchResult,
	YoutubeDownloadResult,
	errorHandling,
} from "../Types";

async function search(
	query: string
): Promise<YoutubeSearchResult[] | errorHandling> {
	try {
		const { data } = await Axios.get(YoutubeSearchBaseUrl + "/results", {
			params: {
				search_query: query,
			},
		}).catch((e: any) => e?.response);
		const $ = Cheerio(data);
		let _string = "";
		$("script").each((i: number, e: any) => {
			if (/var ytInitialData = /gi.exec($(e).html())) {
				_string += $(e)
					.html()
					.replace(/var ytInitialData = /i, "")
					.replace(/;$/, "");
			}
		});
		const _initData =
			JSON.parse(_string).contents.twoColumnSearchResultsRenderer
				.primaryContents;

		const Results: any[] = [];
		let _render = null;
		if (_initData.sectionListRenderer) {
			_render = _initData.sectionListRenderer.contents
				.filter((item: any) =>
					item?.itemSectionRenderer?.contents.filter(
						(v: any) =>
							v.videoRenderer || v.playlistRenderer || v.channelRenderer
					)
				)
				.shift().itemSectionRenderer.contents;
		}
		if (_initData.richGridRenderer) {
			_render = _initData.richGridRenderer.contents
				.filter(
					(item: any) => item.richGridRenderer && item.richGridRenderer.contents
				)
				.map((item: any) => item.richGridRenderer.contents);
		}
		for (const item of _render) {
			if (item.videoRenderer && item.videoRenderer.lengthText) {
				const video = item.videoRenderer;
				const title: string = video?.title?.runs[0]?.text || "";
				const duration: string = video?.lengthText?.simpleText || "";
				const thumbnail: string =
					video?.thumbnail?.thumbnails[video?.thumbnail?.thumbnails.length - 1]
						.url || "";
				const uploaded: string = video?.publishedTimeText?.simpleText || "";
				const views: string =
					video?.viewCountText?.simpleText?.replace(/[^0-9.]/g, "") || "";
				if (title && thumbnail && duration && uploaded && views) {
					Results.push({
						title,
						thumbnail,
						duration,
						uploaded,
						views,
						url: "https://www.youtube.com/watch?v=" + video.videoId,
					});
				}
			}
		}
		return Results;
	} catch (e: any) {
		return {
			error: true,
			message: String(e),
		};
	}
}
async function validatingUrlRequest(): Promise<string> {
	const { headers, status } = await Axios.get(YoutubeDownloadBaseUrl, {
		maxRedirects: 0,
	}).catch((e: any) => e?.response);
	if (status === 301 || (status === 302 && headers && headers["location"])) {
		return headers["location"];
	} else {
		return YoutubeDownloadBaseUrl;
	}
}
async function download(
	url: string
): Promise<YoutubeDownloadResult | errorHandling> {
	try {
		const validUrl: string = await validatingUrlRequest();
		const { data } = await Axios.request({
			url:
				YoutubeDownloadBaseUrl.replace(/https:\/\//, "https://api.") +
				"/api/convert",
			["method"]: "POST",
			["headers"]: {
				["Accept"]: "application/json, tex/plain, */*",
				["Content-Type"]: "application/json",
				["referer"]: validUrl.split("/").slice(0, 3).join("/") + "/",
			},
			data: JSON.stringify({ url }),
		}).catch((e: any) => e?.response);
		if (data && typeof data === "object") {
			const urls: { url: string; quality: string; ext: string }[] = [];
			for (const _url of data.url) {
				urls.push({
					["url"]: _url.url,
					["quality"]: _url.quality || _url.subname,
					["ext"]: _url.ext || _url.type,
				});
				if (urls.length >= 2) {
					break;
				}
			}
			return {
				title: data.meta.title,
				source: data.meta.source,
				duration: data.meta.duration,
				thumbnail: data.thumb,
				urls,
				mp3: data.mp3Converter,
			};
		} else {
			if (data?.code === 102) {
				throw new Error("Probably invalid youtube url.");
			} else {
				throw new Error(
					data?.message || `failed to fetch data from ${YoutubeDownloadBaseUrl}`
				);
			}
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e),
		};
	}
}

export { search, download };
