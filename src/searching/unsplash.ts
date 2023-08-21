import { Axios } from "../Utils"
import { UnsplashBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { UnsplashSearchResults } from "../Types"

async function search (
	query: string,
	page = 1
): Promise<UnsplashSearchResults[] | errorHandling> {
	try {
		const { data } = await Axios.get(UnsplashBaseUrl + "/search/photos", {
			headers: {
				"Content-Type": "application/json",
				authorization:
					"Client-ID 7oM5DivqfP1jh19NoEU7UZiWrcJIzYBC2f8B9fVRMug"
			},
			params: {
				page,
				per_page: 12,
				query,
				orientation: "portrait",
				order_by: "latest",
				content_filter: "low"
			}
		}).catch((e: any) => e?.response)
		if (data && typeof data === "object" && data.results) {
			const _temp: any[] = []
			for (const key of data.results) {
				// Just take what I want.
				_temp.push({
					id: key.id,
					created_at: key.created_at,
					updated_at: key.updated_at,
					urls: { ...key.urls },
					links: {
						download: key.links.download
					},
					user: {
						username: key.user.username,
						bio: key.user.bio,
						social: { ...key.user.social }
					}
				})
			}
			if (Array.isArray(_temp) && _temp.length) {
				return _temp
			} else {
				throw new Error(data?.errors || "failed retrieve data")
			}
			console.log(data.results[0])
		} else {
			throw new Error(data?.errors || "failed retrieve data")
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { search }
