<div align="center">
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
  - [x] Youtube
  - [x] Anoboy
  - [x] Komiku.id
  - [x] Danbooru
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
  - [x] Facebook
    - [x] [v1](https://getmyfb.com)
  - [x] ZippyShare. [reference](https://github.com/superXdev/zippyshare-downloader)
    - [x] download
- [ ] Searching
  - [x] Unsplash
    - [x] search
  - [x] Danbooru
    - [x] search

## Usage

#### Install packages.

NPM version not working

```bash
yarn add frieren-scraper
```

Using GitHub version to get latest fix/update.

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
const Obj = await youtube.download("https://www.youtube.com/watch?v=xxx");
console.log(Obj);
```

#### Tiktok

```js
import { tiktok } from "frieren-scraper";

// v1
const Obj = await tiktok.v1("https://TIKTOK_URL");
console.log(Obj);

// others version will added soon.
```

#### Instagram

```js
import { instagram } from "frieren-scraper";

// v1
const Obj = await instagram.v1("https://instagram_URL");
console.log(Obj);

// others version will added soon.
```

#### Facebook.

```js
import { facebook } from "frieren-scraper";

// v1
const Obj = await facebook.v1("https://FACEBOOK_URL");
console.log(Obj);

// others version will added soon.
```

#### Story WhatsApp Videos.

```js
import { storyWa } from "frieren-scraper";

// fetch popular videos
const ArrObj = await storyWa.popular();
console.log(ArrObj);

// search videos by query
const ArrObj = await storyWa.search("query");
console.log(ArrObj);
```

#### ZippyShare.

```js
import { zippyshare } from "frieren-scraper";

// fetch direct download url
const Obj = await zippyshare.download("https://ZIPPYSHARE_URL");
console.log(Obj);
```

### Anime/comic.

#### Komiku.id.

```js
import { komikuId } from "frieren-scraper";

// fetch latest comic
const ArrObj = await komikuId.latest();
console.log(ArrObj);

// search comic by query
const ArrObj = await komikuId.search("query");
console.log(ArrObj);

// fetch comic/chapter detail by url.
const Obj = await komikuId.detail("https://KOMIKUID_URL");
console.log(Obj);
```

#### Otakudesu.

```js
import { otakudesu } from "frieren-scraper";

// fetch latest anime
const ArrObj = await otakudesu.latest();
console.log(ArrObj);

// search anime by query
const ArrObj = await otakudesu.search("query");
console.log(ArrObj);

// fetch anime detail by url
const Obj = await otakudesu.detail("https://OTAKUDESU_URL");
console.log(Obj);
```

#### Anoboy.

```js
import { anoboy } from "frieren-scraper";

// fetch latest anime
const ArrObj = await anoboy.latest();
console.log(ArrObj);

// search anime by query
const ArrObj = await anoboy.search("query");
console.log(ArrObj);

// fetch anime detail by url
const Obj = await anoboy.search("https://ANOBOY_URL");
console.log(Obj);
```

#### Doujindesu.

```js
import { doujindesu } from "frieren-scraper";

// fetch latest doujin
const ArrObj = await doujindesu.latest();
console.log(ArrObj);

// search doujin by query
const ArrObj = await doujindesu.search("query");
console.log(ArrObj);

// fetch doujin detail by url
const Obj = await doujindesu.detail("https://DOUJINDESU_URL");
console.log(Obj);
```

### Searching?

#### Unsplash.

```js
import { unsplash } from "frieren-scraper";

// Search images by query
const ArrObj = await unsplash.search("query");
console.log(ArrObj);
```

#### Danbooru.

```js
import { danbooru } from "frieren-scraper";

// Search images by query
const ArrObj = await danbooru.search("query");
console.log(ArrObj);
```

### Error Handling Example.

There is probably no need to use statement try/catch, it is already handle.

```js
import { youtube } from "frieren-scraper";

youtube.download("YOUTUBE_URL").then((Obj) => {
  if (Obj.error) {
    // Error
    console.log(Obj.message);
  } else {
    // ...Your code
    console.log(Obj);
  }
});

// Promise
const Obj = await youtube.download("YOUTUBE_URL");

if (Obj.error) {
  // Error
  console.log(Obj.message);
} else {
  // ...Your code.
  console.log(Obj);
}
```

### Note.

This repository project is a learning exercise, and as such it utilizes references from other open source repositories. No commercial use is intended, and all efforts have been made to ensure proper attribution has been given to any referenced libraries and code.
