import { Axios } from "../Utils"

import { PrivateWorkerApiItsrose } from "../Constant"
import { errorHandling } from "../Interface"
import { StableDiffusionResult } from "../Types"

class Diffusion {
	private example: string
	private advanceExample: string
	#queue
	constructor () {
		this.#queue = 0
		this.example = "beatiful girl, looking to viewer, warm smile,"
		this.advanceExample =
			"SamDoesArt, a girl, brown hair, blue eyes, black hoodie, piercing, tattoos, day, sunny, cars, city, HDRI, masterpiece, sharp focus, smooth, illustration, golden ratio,"
	}

	protected add (): void {
		this.#queue = this.#queue + 1
	}

	protected remove (): void {
		this.#queue = this.#queue - 1
	}

	public async stable (
		prompt: string,
		seed: string | number | boolean = false
	): Promise<StableDiffusionResult | errorHandling> {
		if (this.#queue >= 5) {
			return {
				error: true,
				message: "Please wait, you in position " + (this.#queue + 1)
			}
		}
		try {
			this.add()
			if (!seed) {
				seed = Math.random().toString().substring(2, 11)
			}
			const { data } = await Axios.request({
				baseURL: PrivateWorkerApiItsrose,
				url: "/api/stableDiffusion",
				method: "POST",
				data: new URLSearchParams({ prompt, seed: String(seed) })
			}).catch((e: any) => e?.response)
			this.remove()
			return data
		} catch (e: any) {
			return {
				error: true,
				message: String(e)
			}
		}
	}
}
export const diffusion = new Diffusion()
