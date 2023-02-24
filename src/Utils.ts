import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import cheerio from 'cheerio'

function CreateInstance (
  headers?: { [key: string]: any },
  config?: AxiosRequestConfig
): AxiosInstance {
  return axios.create({
    timeout: 15000,
    headers: {
      'User-Agent': 'Frieren-Scraper (0.0.1x)',
      ...headers
    },
    ...config
  });
}
export const Axios = CreateInstance()
export function Cheerio (data: any): any {
  return cheerio.load(data)
}
