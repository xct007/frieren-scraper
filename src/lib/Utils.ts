import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import cheerio from "cheerio";

export function Axios(
	headers?: { [key: string]: any },
	config?: AxiosRequestConfig
): AxiosInstance {
	return axios.create({
		timeout: 15000,
		headers: {
			["User-Agent"]: "Frieren-Scraper (0.0.1x)",
			...headers,
		},
		...config,
	});
}
export function Cheerio(data: any): any {
	return cheerio.load(data);
}
