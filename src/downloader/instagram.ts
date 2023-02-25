import { Axios, Cheerio } from "../Utils";
import { InstagramDownloadBaseUrlV1 } from "../Constant";
import { InstagramDownloadResults, errorHandling } from "../Types";

class Instagrams {
	constructor() {}
	public static async v1(
		url: string
	): Promise<InstagramDownloadResults[] | errorHandling> {
		try {
			const { data, headers } = await Axios.request({
				url: InstagramDownloadBaseUrlV1,
				method: "POST",
				headers: {
					["Content-Type"]: "application/x-www-form-urlencoded",
					["Upgrade-Insecure-Requests"]: "1",
					["Referer"]: InstagramDownloadBaseUrlV1,
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
}
export const instagram: {
	v1: Function;
} = {
	v1: Instagrams.v1,
};
