import { Axios, Cheerio } from "../Utils";
import { InstagramDownloadBaseUrl } from "../Constant";
import { errorHandling } from "../Interface";
import { InstagramDownloadResults } from "../Types";

class Instagrams {
	constructor() {}
	public static async v1(
		url: string
	): Promise<InstagramDownloadResults[] | errorHandling> {
		try {
			const { data, headers } = await Axios.request({
				url: InstagramDownloadBaseUrl.v1,
				method: "POST",
				headers: {
					["Content-Type"]: "application/x-www-form-urlencoded",
					["Upgrade-Insecure-Requests"]: "1",
					["Referer"]: InstagramDownloadBaseUrl.v1,
					["Referrer-Policy"]: "strict-origin-when-cross-origin",
				},
				data: new URLSearchParams({ url, submit: "" }),
			}).catch((e: any) => e?.response);
			const $ = Cheerio(data);
			const _temp: any[] = [];
			$("#downloadhere > a[download='']").each((i: number, e: Element) => {
				_temp.push({ url: $(e).attr("href") });
			});
			if (Array.isArray(_temp) && _temp.length) {
				return _temp;
			} else {
				throw new Error(
					$(".alert-danger").text() || "v1: Failed to retrieve data."
				);
			}
		} catch (e: any) {
			return {
				error: true,
				message: String(e?.Error || e),
			};
		}
	}
	public static async v2(
		url: string
	): Promise<InstagramDownloadResults[] | errorHandling> {
		try {
			const { data: _data, headers } = await Axios.request({
				baseURL: InstagramDownloadBaseUrl.v2,
				method: "GET",
				headers: {
					["User-Agent"]: "okhttp/4.20.0",
				},
			}).catch((e) => e?.response);
			const _$ = Cheerio(_data);
			const _opts = {
				referer: _$("input[name='referer']").attr("value"),
				locale: _$("input[name='locale']").attr("value"),
				_token: _$("input[name='_token']").attr("value"),
				link: url,
			};
			const { data } = await Axios.request({
				baseURL: InstagramDownloadBaseUrl.v2,
				url: "/download",
				method: "POST",
				headers: {
					["User-Agent"]: "okhttp/4.20.0",
					cookie: headers["set-cookie"],
				},
				data: new URLSearchParams({ ..._opts }),
			}).catch((e) => e?.response);
			const $ = Cheerio(data);
			const _temp: any[] = [];
			$("#result")
				.find("a[target='_blank']")
				.each((i: number, e: Element) => {
					const url = $(e).attr("href");
					_temp.push({ url });
				});
			if (_temp.length) {
				return _temp;
			} else {
				throw new Error("Probably wrong url or private post/reel");
			}
		} catch (e) {
			return {
				error: true,
				message: String(e),
			};
		}
	}
}
export const instagram: {
	v1: Function;
	v2: Function;
} = {
	v1: Instagrams.v1,
	v2: Instagrams.v2,
};
