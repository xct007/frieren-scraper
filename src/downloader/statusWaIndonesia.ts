import { Axios } from "../Utils";
import { statusWaIndonesiaBaseUrl } from "../Constant";
import { statusWaIndonesiaAny, errorHandling } from "../Types";

async function popular(
	page: string = "1",
    seed: string = "6316"
): Promise<statusWaIndonesiaAny[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			url:
				statusWaIndonesiaBaseUrl +
				"/videostatus_studio/videostatus_indonesia/get_new_video_portrait.php",
			method: "POST",
			headers: { ["Content-Type"]: "application/x-www-form-urlencoded" },
			data: new URLSearchParams({ seed, page, type: "popular" }),
		}).catch((e: any) => e?.response);
		if (data && typeof data === "object") {
			return data.items;
		} else {
			throw new Error(`data: ${typeof data}`);
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e),
		};
	}
}
async function search(
	query: string,
	page: string = "1",
	seed: string = "3013"
): Promise<statusWaIndonesiaAny[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			url:
				statusWaIndonesiaBaseUrl +
				"/videostatus_studio/videostatus_indonesia/get_new_video_portrait.php",
			method: "POST",
			headers: { ["Content-Type"]: "application/x-www-form-urlencoded" },
			data: new URLSearchParams({ s: query, seed, page, type: "search" }),
		}).catch((e: any) => e?.response);
		if (data && typeof data === "object") {
			return data.items;
		} else {
			throw new Error(`data: ${typeof data}`);
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e),
		};
	}
}
export { popular, search };
