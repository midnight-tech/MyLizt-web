export interface CatalogoAnime {
  mal_id : number,
  image_url : string,
  title: string,
  airing : boolean,
  synopsis: boolean,
  type: string,
  episodes: number,
  score: number,
  start_date: string,
  end_date : string,
  rated?: string
}

export interface bookCatalogo{
  id: string,
  volumeInfo : {
    authors: string[],
    description: string,
    imageLinks?: {
      thumbnail: string
    }
    language: string,
    subtitle: string,
    title: string
  }
}

export interface serieCatalogo {
  backdrop_path: string,
  id: number,
  name: string,
  overview: string,
  poster_path: string,
  vote_average: number,
  popularity: number
}