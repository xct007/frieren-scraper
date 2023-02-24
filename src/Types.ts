export type errorHandling = {
	error: boolean;
	message: string;
};
export type DoujindesuLatest = {
	title: string;
	chapter: string;
	thumbnail: string;
	url: string | any;
}[];
export type DoujindesuSearch = {
	title: string;
	type: string;
	status: string;
	score: string;
	thumbnail: string;
	url: string;
}[];
export type DoujindesuDetail = {
	title: string;
	titles: string;
	tags: string;
	thumbnail: string;
	metadata?: {};
	links: {
		title: string;
		url: string;
	}[];
};
export type OtakudesuLatest = {
	title: string;
	day: string;
	date: string;
	url: string;
	thumbnail: string;
}[];
export type OtakudesuSearch = {
	title: string;
	genres: string;
	status: string;
	rating: string;
	url: string;
	thumbnail: string;
}[];
export type OtakudesuDetail = {};
export type YoutubeSearchResult = {
	title: string;
	thumbnail: string;
	duration: string;
	uploaded: string;
	views: string;
	url: string;
}[];
export type YoutubeDownloadResult = {
	title: string;
	source: string;
	duration: string;
	thumbnail: string;
	urls: { url: string; quality: string; ext: string }[];
	mp3: string;
};
export type AnoboyLatest = {
	title: string;
	update: string;
	thumbnail: string;
	url: string;
}[];
export type AnoboyDetail = {
	title: string;
	judi: string;
	urls: { source: string; url: string; resolution: string }[];
};
export type StatusWaIndonesiaAny = {
	id: string;
	title: string;
	video_thumb: string;
	video_url: string;
	download: string;
	date_time_i?: string;
}[];
export type UnsplashSearchResults = {
	id: string;
	created_at: string;
	updated_at: string;
	urls: { [key: string]: any };
	links: {
		download: string;
	};
	user: {
		username: string;
		bio: string;
		social: { [key: string]: any };
	};
}[];
export type InstagramDownloadResults = {
	url: string;
}[];
export type KomikuIdLatestResults = {
	title: string;
	updated: string;
	chapter: string;
	thumbnail: string;
	url: string;
}[];
export type KomikuIdDetailResult = {
	Manga: {
		isManga: boolean;
		title: string;
		metadata: { [key: string]: any };
		description: string;
		chapters: { chapter: string; url: string }[];
	};
	Chapter: {
		isChapter: boolean;
		title: string;
		images: string[];
	};
};
export type KomikuIdSearchResults = {
	title: string;
	title_id: string;
	awal?: string;
	terbaru?: string;
	description: string;
	thumbnail: string;
	url: string;
}[];
