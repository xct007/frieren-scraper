import { Axios } from "../Utils"
import { PrivateApiPhotoFunia } from "../Constant"
import { errorHandling } from "../Interface"
import { PhotoFuniaListResults, PhotoFuniaCreatedResult } from "../Types"

async function listEffects (): Promise<PhotoFuniaListResults[] | errorHandling> {
	try {
		const { data } = await Axios.request({
			baseURL: PrivateApiPhotoFunia,
			url: "/getList"
		}).catch((e: any) => e?.response)
		if (typeof data === "object") {
			return data
		} else {
			throw new Error(`Something went wrong with ${PrivateApiPhotoFunia}`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}

async function create (
	name: string,
	opts: { type: string; input: string }
): Promise<PhotoFuniaCreatedResult | errorHandling> {
	try {
		const { data } = await Axios.post(
			PrivateApiPhotoFunia + "/createRequest/" + name,
			opts
		).catch((e: any) => e?.response)
		if (typeof data === "object") {
			return data
		} else {
			throw new Error(`Something went wrong with ${PrivateApiPhotoFunia}`)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export const photofunia = { listEffects, create }
