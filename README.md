<div align="center">
  <h1>Swiper no Swiping</h1>
  <img src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/nickelodeon-dora-the-explorer-swiper-no-swiping-fox-ivof-miaol.jpg"/>
</div>

### Note.

For all swiper.

This repository project is a learning exercise, and as such it utilizes references from other open source repositories. No commercial use is intended, and all efforts have been made to ensure proper attribution has been given to any referenced libraries and code.

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
  - [x] Youtube
  - [x] Anoboy
  - [x] Komiku.id
- App
  - [x] [Status Video Wa Indonesia](https://play.google.com/store/apps/details?id=com.videostatus.indonesia)
  - [x] [Unsplash](https://play.google.com/store/apps/details?id=com.aqteam.photofree)
  - [x] [Downloader for tiktok](https://play.google.com/store/apps/details?id=com.downloaderfor.tiktok)
    - `App use rapid Api.`

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
  - [x] Youtube
    - [x] search
      - [x] videos
    - [x] dowload
  - [x] Status Video Wa Indonesia
    - [x] popular
    - [x] search
  - [x] Instagram
    - [x] [v1](https://downloadgram.org)
  - [x] Tiktok
    - [x] v1
- [ ] Searching
  - [x] Unsplash
    - [x] search

## Usage

#### Install packages.

```bash
yarn add frieren-scraper
```

or using GitHub version.

```bash
yarn add github:xct007/frieren-scraper
```

## Example use
### Social Media.

#### Youtube

```js
import { youtube } from "frieren-scraper";

// searching videos
const ArrObj = await youtube.search("rose gone mv");
console.log(ArrObj);

// fetch download url;
const ArrObj = await youtube.download("https://www.youtube.com/watch?v=xxx");
console.log(ArrObj);
```

#### Tiktok

```js
import { tiktok } from "frieren-scraper";

// v1
const ArrObj = await tiktok.v1("https://TIKTOK_URL");
console.log(ArrObj);

// others version will added soon.
```

#### Instagram

```js
import { instagram } from "frieren-scraper";

// v1
const ArrObj = await instagram.v1("https://instagram_URL");
console.log(ArrObj);

// others version will added soon.
```

- Story WhatsApp Videos.

```js
import { storyWa } from "frieren-scraper";

// fetch popular videos
const ArrObj = await storyWa.popular();
console.log(ArrObj)

// search videos by query
const ArrObj = await storyWa.search("query");
console.log(ArrObj)

```

### Anime/comic.

#### Komiku.id.

```js
import { komikuId } from "frieren-scraper";

// fetch latest comic
const ArrObj = await komikuId.latest()
console.log(ArrObj)

// search comic by query
const ArrObj = await komikuId.search("query");
console.log(ArrObj)

// fetch comic/chapter detail by url.
const ArrObj = await komikuId.search("https://KOMIKUID_URL");
console.log(ArrObj)

```

#### Otakudesu.

```js
import { otakudesu } from "frieren-scraper";

// fetch latest anime
const ArrObj = await otakudesu.latest()
console.log(ArrObj)

// search anime by query
const ArrObj = await otakudesu.search("query");
console.log(ArrObj)

// fetch anime detail by url
const ArrObj = await otakudesu.search("https://OTAKUDESU_URL");
console.log(ArrObj)

```

#### Anoboy.

```js
import { anoboy } from "frieren-scraper";

// fetch latest anime
const ArrObj = await anoboy.latest()
console.log(ArrObj)

// search anime by query
const ArrObj = await anoboy.search("query");
console.log(ArrObj)

// fetch anime detail by url
const ArrObj = await anoboy.search("https://ANOBOY_URL");
console.log(ArrObj)

```

### Searching?

#### Unsplash.

```js
import { unsplash } from "frieren-scraper";

// Search images by query
const ArrObj = await unsplash.search("query");
```
