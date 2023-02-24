import { YoutubeSearchResult, errorHandling } from "../Types.js";
declare function search(query: string): Promise<YoutubeSearchResult[] | errorHandling>;
export { search };
