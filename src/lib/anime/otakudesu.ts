import { Axios, Cheerio } from "../Utils";
import { OtakudesuBaseUrl } from "../Constant";
import { errorHandling, OtakudesuLatest, OtakudesuSearch } from "../Types";

const _Axios = Axios();

async function latest(): Promise<OtakudesuLatest[] | errorHandling> {
	try {
		const { data } = await _Axios
			.get(OtakudesuBaseUrl + "/ongoing-anime")
			.catch((e: any) => e?.response);
		const $ = Cheerio(data);
		const _temp: any[] = [];
		$(".venz > ul > li").each((i: number, e: any) => {
			const title: string = $(e).find("h2.jdlflm").text();
			const day: string = $(e).find(".epztipe").text().trim();
			const date: string = $(e).find(".newnime").text().trim();
			const url: string = $(e).find(".thumb > a").attr("href");
			const thumbnail: string = $(e).find(".thumbz > img").attr("src");
			_temp.push({ title, day, date, url, thumbnail });
		});
		if (Array.isArray(_temp) && _temp.length) {
			return _temp;
		} else {
			throw "_temp is not an Array";
		}
	} catch (e: any) {
		return {
			error: true,
			message: e?.TypeError || String(e),
		};
	}
}
async function search(
	query: string
): Promise<OtakudesuSearch[] | errorHandling> {
	try {
		const { data } = await _Axios
			.get(OtakudesuBaseUrl, {
				params: {
					s: query,
					post_type: "anime",
				},
			})
			.catch((e: any) => e?.response);
		const $ = Cheerio(data);
		const _temp: any = [];
		$(".venutama > .page > ul > li").each((i: number, e: any) => {
			const title: string = $(e).find("h2").text().trim();
			const url: string = $(e).find("h2 > a").attr("href");
			const _set: string[] = [];
			$(e)
				.find(".set")
				.each((_i: number, _e: any) => {
					_set.push($(_e).text());
				});
			let _metadata: any = {};
			_set.forEach((v: string) => {
				const [a, b] = v.split(":");
				Object.assign(_metadata, {
					[a.toLowerCase().trim()]: b.trim(),
				});
			});
			const thumbnail: string = $(e).find("img").attr("src");
			_temp.push({ title, ..._metadata, url, thumbnail });
		});
		if (Array.isArray(_temp) && _temp.length) {
			return _temp;
		} else {
			throw `${query} probably not found`;
		}
	} catch (e: any) {
		return {
			error: true,
			message: e?.TypeError || String(e),
		};
	}
}
const otakudesu = { latest, search };
export { otakudesu };
