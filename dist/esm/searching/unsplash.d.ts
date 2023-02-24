import { UnsplashSearchResults, errorHandling } from "../Types.js";
declare function search(query: string, page?: number): Promise<UnsplashSearchResults[] | errorHandling>;
export { search };
