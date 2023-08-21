import { Axios } from "../Utils"
import { MusicApiJamendoBaseUrl } from "../Constant"
import { errorHandling } from "../Interface"
import { MusicApiJamendoResults } from "../Types"

function validatingLimit (value: number) {
	if (value >= 100) {
		return 50
	}
	return value
}
async function search (
	query: string,
	limitValue = 50
): Promise<MusicApiJamendoResults[] | errorHandling> {
	try {
		const { data } = await Axios.get(MusicApiJamendoBaseUrl + "/v3.0/tracks/", {
			params: {
				client_id: "f5db3eb4",
				format: "json",
				limit: validatingLimit(limitValue),
				order: "downloads_total",
				include: "",
				imagesize: "200",
				groupby: "artist_id",
				namesearch: query
			}
		}).catch((e: any) => e?.response)
		if (
			data &&
			data.results &&
			Array.isArray(data.results) &&
			data.results.length
		) {
			const _sortie: any[] = []
			const _filtered: any[] = data.results.filter(
				(v: { [key: string]: any }) => v.audiodownload_allowed && v.audio
			)
			for (const obj of _filtered) {
				_sortie.push({
					title: obj.name,
					artist: obj.artist_name,
					album: obj.album_name,
					release_date: obj.releasedate,
					thumbnail: obj.image,
					audio: obj.audio
				})
			}
			return _sortie
		} else {
			throw new Error(
				data?.headers?.error_message ||
					data?.headers?.warnings ||
					`Failed to retrieve data from ${MusicApiJamendoBaseUrl}`
			)
		}
	} catch (e: any) {
		return {
			error: true,
			message: String(e)
		}
	}
}
export { search }
