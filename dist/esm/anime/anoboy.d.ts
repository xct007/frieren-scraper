import { AnoboyLatest, AnoboyDetail, errorHandling } from "../Types.js";
declare function latest(): Promise<AnoboyLatest[] | errorHandling>;
declare function search(query: string): Promise<AnoboyLatest[] | errorHandling>;
declare function detail(url: string): Promise<AnoboyDetail | errorHandling>;
export { latest, search, detail };
