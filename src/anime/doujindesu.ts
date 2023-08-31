import { Axios, Cheerio } from "../Utils";
import { DoujindesuBaseUrl } from "../Constant";
import { errorHandling } from "../Interface";
import { DoujindesuLatest, DoujindesuSearch, DoujindesuDetail } from "../Types";

async function latest (): Promise<DoujindesuLatest[] | errorHandling> {
	try {
		const { data } = await Axios.get(DoujindesuBaseUrl).catch(
			(e: any) => e?.response
		);
		const $ = Cheerio(data);
		const _temp: any[] = [];
		$(".feed#archives > .entries > .entry").each((i: number, e: Element) => {
			const title: string = $(e).find("a").attr("title");
			const url: string = DoujindesuBaseUrl + $(e).find("a").attr("href");
			const thumbnail: string = $(e).find("img").attr("src");
			const chapter: string = $(e).find(".artists > a > span").text();
			_temp.push({
				title,
				chapter,
				thumbnail,
				url
			});
		});
		if (Array.isArray(_temp) && _temp.length) {
			return _temp;
		} else {
			throw new Error("_temp is not an Array");
		}
	} catch (e: any) {
		return { error: true, message: e?.TypeError || String(e) };
	}
}
async function search (
	query: string
): Promise<DoujindesuSearch[] | errorHandling> {
	try {
		const { data } = await Axios.get(DoujindesuBaseUrl, {
			params: {
				s: query
			}
		}).catch((e: any) => e?.response);
		const $ = Cheerio(data);
		const _temp: any[] = [];
		$(".entries > .entry").each((i: number, e: Element) => {
			const title: string = $(e).find("a").attr("title");
			const thumbnail: string = $(e).find("img").attr("src");
			const type: string = $(e).find(".type").text().trim();
			const score: string = $(e).find(".score").text().trim();
			const status: string = $(e).find(".status").text().trim();
			const url: string = DoujindesuBaseUrl + $(e).find("a").attr("href");
			_temp.push({ title, thumbnail, type, score, status, url });
		});
		if (Array.isArray(_temp) && _temp.length) {
			return _temp;
		} else {
			throw new Error("_temp is not an Array");
		}
	} catch (e: any) {
		return { error: true, message: e?.TypeError || String(e) };
	}
}
async function detail (url: string): Promise<DoujindesuDetail | errorHandling> {
	if (!url.includes(DoujindesuBaseUrl)) {
		return {
			error: true,
			message: "Invalid url!"
		};
	}
	try {
		const { data } = await Axios.get(url).catch((e: any) => e?.response);
		const $ = Cheerio(data);

		const title: string = $(".thumbnail > a > img").attr("title").trim();
		const titles: string = $("h1 > span > i").text().trim();
		const thumbnail: string = $(".thumbnail > a > img").attr("src");

		const _metaData: any[] = [];
		$(".metadata > table > tbody > tr").each((i: number, e: Element) => {
			const rowD: any = $(e).find("td");
			const rowA: any[] = [];
			rowD.each((_i: number, _e: Element) => {
				rowA.push($(_e).text());
			});
			_metaData.push(rowA);
		});
		const metadata = _metaData.reduce((obj, [key, value]) => {
			obj[key.toLowerCase().replace(/\s/g, "_")] = value.trim();
			return obj;
		}, {});

		const _tags: string[] = [];
		$(".tags > a").each((i: number, e: Element) => {
			_tags.push($(e).text().trim());
		});
		const tags: string = _tags.join(", ");

		const links: { title: string; url: string }[] = [];
		$(".linkdl > a").each((i: number, e: Element) => {
			links.push({ title: $(e).attr("title"), url: $(e).attr("href") });
		});
		return {
			title,
			titles,
			tags,
			thumbnail,
			metadata,
			links
		};
	} catch (e: any) {
		return { error: true, message: e?.TypeError || String(e) };
	}
}
export { latest, search, detail };
