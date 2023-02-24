<div align="center">
  <h1>Swiper no Swiping</h1>
  <img src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/nickelodeon-dora-the-explorer-swiper-no-swiping-fox-ivof-miaol.jpg"/>
</div>

### Challenge
- Scrape only using
  - [x] Axios
  - [x] Cheerio

and results must be JSON Object.

### Target
You decide, you can open issues what website/app and data to be scrapped.
- Website
  - [x] Doujindesu
  - [x] Otakudesu
  - [ ] Youtube
  - [x] Anoboy
  - [x] Komiku.id
- App
  - [x] [Status Video Wa Indonesia](https://play.google.com/store/apps/details?id=com.videostatus.indonesia)
  - [x] [Unsplash](https://play.google.com/store/apps/details?id=com.aqteam.photofree)

### Progress.
- [ ] Anime
  - [x] Doujindesu
    - [x] latest
    - [x] search
    - [x] detail
  - [x] Otakudesu
    - [x] latest
    - [x] search
    - [x] detail
  - [x] Anoboy
    - [x] latest
    - [x] search
    - [x] detail
  - [x] Komiku.id
    - [x] latest
    - [x] search
    - [x] detail
- [ ] Downloader
  - [ ] Youtube
    - [ ] search
      - [x] videos
      - [ ] playlist
      - [ ] channel
    - [x] dowload
  - [x] Status Video Wa Indonesia
    - [x] popular
    - [x] search
  - [ ] Instagram
    - [x] [v1](https://downloadgram.org)
- [ ] Searching
  - [x] Unsplash
    - [x] search

### Test build
- Install packages.

using npm instead yarn.
```bash
npm i github:xct007/frieren-scraper
```
- Usage example.
```js
import { unsplash } from "frieren-scraper";

const ArrObj = await unsplash.search("flowers");
console.log(ArrObj)
```
see all exported module.
```js
import * as scrape from "frieren-scraper";
console.log(scrape)
```
