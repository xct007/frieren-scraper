import { UnsplashSearchResults, errorHandling } from "../Types";
declare function search(query: string, page?: number): Promise<UnsplashSearchResults[] | errorHandling>;
export { search };
