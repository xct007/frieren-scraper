import { Axios } from "../Utils"
import { StatusWaIndonesiaBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { StatusWaIndonesiaAny } from "../Types"

async function popular (
	page = "1",
	seed = "6316"
): Promise<StatusWaIndonesiaAny[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			url:
				StatusWaIndonesiaBaseUrl +
				"/videostatus_studio/videostatus_indonesia/get_new_video_portrait.php",
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			data: new URLSearchParams({ seed, page, type: "popular" })
		}).catch((e: any) => e?.response)
		if (data && typeof data === "object") {
			return data.items
		} else {
			throw new Error(`data: ${typeof data}`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
async function search (
	query: string,
	page = "1",
	seed = "3013"
): Promise<StatusWaIndonesiaAny[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			url:
				StatusWaIndonesiaBaseUrl +
				"/videostatus_studio/videostatus_indonesia/get_new_video_portrait.php",
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			data: new URLSearchParams({ s: query, seed, page, type: "search" })
		}).catch((e: any) => e?.response)
		if (data && typeof data === "object") {
			return data.items
		} else {
			throw new Error(`data: ${typeof data}`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { popular, search }
