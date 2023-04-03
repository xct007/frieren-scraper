/**
 * JUST A SIMPLE
 * REQUEST WITH INDONESIA IP
 * FROM @-- <https://api.itsrose.site/image/h5tuqq> APIs
 */

import { Axios } from "../Utils";
import { errorHandling } from "../Interface";
import { APIsItsRose } from "../Constant";

type ResponseResult = {
	image: string;
	images: string[];
};
export async function h5tuqq(
	url: string
): Promise<ResponseResult | errorHandling> {
	let isImageUrl: boolean = false;
	const { headers } = await Axios.head(url).catch((e: any) => e?.response);
	if (
		headers &&
		headers["content-type"] &&
		/image/i.test(headers["content-type"])
	) {
		isImageUrl = true;
	}
	if (!isImageUrl) {
		return {
			error: true,
			message: "url not contains image",
		};
	}
	try {
		const { data } = await Axios.request({
			baseURL: APIsItsRose,
			url: "/image/h5tuqq",
			method: "GET",
			params: {
				url,
			},
		}).catch((e) => e?.response);
		if (!data.status || !data.result) {
			throw new Error(data.message || ":(");
		}
		return data.result;
	} catch (e: any) {
		return {
			error: true,
			message: String(e),
		};
	}
}
