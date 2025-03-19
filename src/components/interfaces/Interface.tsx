export interface Genre {
    id: number;
    name: string;
}

export interface Language {
    iso_639_1: string;
    english_name: string;
}

export interface IMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
    runtime?: number;
    genres?: Genre[];
    spoken_languages?: Language[];
} 