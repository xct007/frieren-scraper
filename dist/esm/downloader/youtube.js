import { Axios, Cheerio } from "../Utils.js";
import { YoutubeBaseUrl } from "../Constant.js";
async function search(query) {
    try {
        const { data } = await Axios.get(YoutubeBaseUrl + "/results", {
            params: {
                search_query: query,
            },
        }).catch((e) => e?.response);
        const $ = Cheerio(data);
        let _string = "";
        $("script").each((i, e) => {
            if (/var ytInitialData = /gi.exec($(e).html())) {
                _string += $(e)
                    .html()
                    .replace(/var ytInitialData = /i, "")
                    .replace(/;$/, "");
            }
        });
        const _initData = JSON.parse(_string).contents.twoColumnSearchResultsRenderer
            .primaryContents;
        const Results = [];
        let _render = null;
        if (_initData.sectionListRenderer) {
            _render = _initData.sectionListRenderer.contents
                .filter((item) => item?.itemSectionRenderer?.contents.filter((v) => v.videoRenderer || v.playlistRenderer || v.channelRenderer))
                .shift().itemSectionRenderer.contents;
        }
        if (_initData.richGridRenderer) {
            _render = _initData.richGridRenderer.contents
                .filter((item) => item.richGridRenderer && item.richGridRenderer.contents)
                .map((item) => item.richGridRenderer.contents);
        }
        for (const item of _render) {
            if (item.videoRenderer && item.videoRenderer.lengthText) {
                const video = item.videoRenderer;
                const title = video?.title?.runs[0]?.text || "";
                const duration = video?.lengthText?.simpleText || "";
                const thumbnail = video?.thumbnail?.thumbnails[video?.thumbnail?.thumbnails.length - 1]
                    .url || "";
                const uploaded = video?.publishedTimeText?.simpleText || "";
                const views = video?.viewCountText?.simpleText?.replace(/[^0-9.]/g, "") || "";
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
    }
    catch (e) {
        return {
            error: true,
            message: String(e),
        };
    }
}
export { search };
