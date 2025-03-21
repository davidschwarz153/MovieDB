export interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  videos?: {
    results: Video[];
  };
}

export interface Video {
  key: string;
  site: string;
  type: string;
}

export interface Cast {
  id: string;
  name: string;
  character: string;
  profile_path: string;
}

export interface Crew {
  id: string;
  name: string;
  job: string;
  profile_path: string;
}
