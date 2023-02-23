import { Axios, Cheerio } from "../Utils";
import { DoujindesuBaseUrl } from "../Constant";
import {
	errorHandling,
	DoujindesuLatest,
	DoujindesuSearch,
	DoujindesuDetail,
} from "../Types";

const _Axios = Axios();

async function latest(): Promise<DoujindesuLatest[] | errorHandling> {
	try {
		const { data } = await _Axios
			.get(DoujindesuBaseUrl)
			.catch((e: any) => e?.response);
		const $ = Cheerio(data);
		let _temp: any[] = [];
		$(".feed#archives > .entries > .entry").each((i: any, e: any) => {
			const title: string = $(e).find("a").attr("title");
			const url: string = DoujindesuBaseUrl + $(e).find("a").attr("href");
			const thumbnail: string = $(e).find("img").attr("src");
			const tags: string | any =
				$(e).attr("data-tags")?.split("|")?.join(", ") || "";
			const chapter: string = $(e).find(".artists > a > span").text();
			_temp.push({
				title,
				chapter,
				thumbnail,
				url,
				tags,
			});
		});
		if (Array.isArray(_temp) && _temp.length) {
			return _temp;
		} else {
			throw "_temp is not an Array";
		}
	} catch (e: any) {
		return { error: true, message: e?.TypeError || String(e) };
	}
}
async function search(
	query: string
): Promise<DoujindesuSearch[] | errorHandling> {
	try {
		const { data } = await _Axios
			.get(DoujindesuBaseUrl, {
				params: {
					s: query,
				},
			})
			.catch((e: any) => e?.response);
		const $ = Cheerio(data);
		const _temp: any[] = [];
		$(".entries > .entry").each((i: number, e: any) => {
			const title: string = $(e).find("a").attr("title");
			const thumbnail: string = $(e).find("img").attr("src");
			const type: string = $(e).find(".type").text().trim();
			const score: string = $(e).find(".score").text().trim();
			const status: string = $(e).find(".status").text().trim();
			const url: string = DoujindesuBaseUrl + $(e).find("a").attr("href");
			const tags: string | any =
				$(e).attr("data-tags")?.split("|")?.join(", ") || "";
			_temp.push({ title, thumbnail, type, score, status, url, tags });
		});
		if (Array.isArray(_temp) && _temp.length) {
			return _temp;
		} else {
			throw "_temp is not an Array";
		}
	} catch (e: any) {
		return { error: true, message: e?.TypeError || String(e) };
	}
}
async function detail(url: string): Promise<DoujindesuDetail | errorHandling> {
	if (!url.includes(DoujindesuBaseUrl)) {
		return {
			error: true,
			message: "Invalid url!",
		};
	}
	try {
		const { data } = await _Axios.get(url).catch((e: any) => e?.response);
		const $ = Cheerio(data);

		const title: string = $(".thumbnail > a > img").attr("title").trim();
		const titles: string = $("h1 > span > i").text().trim();
		const thumbnail: string = $(".thumbnail > a > img").attr("src");

		const _metaData: any[] = [];
		$(".metadata > table > tbody > tr").each((i: any, e: any) => {
			const rowD: any = $(e).find("td");
			const rowA: any[] = [];
			rowD.each((_i: any, _e: any) => {
				rowA.push($(_e).text());
			});
			_metaData.push(rowA);
		});
		const metadata = _metaData.reduce((obj, [key, value]) => {
			obj[key.toLowerCase().replace(/\s/g, "_")] = value.trim();
			return obj;
		}, {});

		const _tags: string[] = [];
		$(".tags > a").each((i: number, e: any) => {
			_tags.push($(e).text().trim());
		});
		const tags: string = _tags.join(", ");

		const links: { title: string; url: string }[] = [];
		$(".linkdl > a").each((i: number, e: any) => {
			links.push({ title: $(e).attr("title"), url: $(e).attr("href") });
		});
		return {
			title,
			titles,
			thumbnail,
			metadata,
			links,
		};
	} catch (e: any) {
		return { error: true, message: e?.TypeError || String(e) };
	}
}
export { latest, search, detail };
