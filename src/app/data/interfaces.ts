import { BookCatalogo } from "./BookCatalogo"
import { AnimeCatalogo } from "./CatalogoAnime"
import { SerieCatalogo } from "./SerieCatalogo"
import { AngularFirestoreDocument } from '@angular/fire/firestore'
import { EPROTO } from "node:constants"
// import { List } from "./List"

export interface CatalogoAnimeInterface {
  mal_id: number,
  image_url: string,
  title: string,
  airing: boolean,
  synopsis: boolean,
  type: string,
  episodes: number,
  score: number,
  start_date: string,
  end_date: string,
  rated?: string
  complete?: CompleteAnime
  getComplete: Function
}

export type CompleteAnime = {
  "request_hash": string,
  "request_cached": boolean,
  "request_cache_expiry": number,
  "mal_id": number,
  "url": string,
  "image_url": string,
  "trailer_url": string,
  "title": string,
  "title_english": string,
  "title_japanese": string,
  "title_synonyms": string[],
  "type": string,
  "source": string,
  "episodes": number,
  "status": string,
  "airing": boolean,
  "aired": {
    "from": string,
    "to": string,
    "prop": {
      "from": {
        "day": number,
        "month": number,
        "year": number
      },
      "to": {
        "day": number,
        "month": number,
        "year": number
      }
    },
    "string": string
  },
  "duration": string,
  "rating": string,
  "score": number,
  "scored_by": number,
  "rank": number,
  "popularity": number,
  "members": number,
  "favorites": number,
  "synopsis": string,
  "background": string | null,
  "premiered": string | null,
  "broadcast": string | null,
  "related": {
    "Adaptation": [
      {
        "mal_id": number,
        "type": string,
        "name": string,
        "url": string
      }
    ]
  },
  "producers": [
    {
      "mal_id": number,
      "type": string,
      "name": string,
      "url": string
    }
  ],
  "licensors": [
    {
      "mal_id": number,
      "type": string,
      "name": string,
      "url": string
    }
  ],
  "studios": [
    {
      "mal_id": number,
      "type": string,
      "name": string,
      "url": string
    }
  ],
  "genres": [
    {
      "mal_id": number,
      "type": string,
      "name": string,
      "url": string
    }
  ],
  "opening_themes": string[],
  "ending_themes": string[]
}

export function instaceOfCatalogoAnime(object: any): object is CatalogoAnimeInterface {
  return object.discriminator === "CatalogoAnime"
}

export interface BookCatalogoInterface {
  id: string,
  volumeInfo: {
    authors: string[],
    description: string,
    imageLinks?: {
      thumbnail: string
    }
    language: string,
    subtitle: string,
    title: string
  }
  complete?: CompleteBook,
  getComplete: Function
}

export type CompleteBook = {
  "kind": string,
  "id": string,
  "etag": string,
  "selfLink": string,
  "volumeInfo": {
    "title": String
    "authors": string[],
    "publisher": string,
    "publishedDate": string,
    "description": string,
    "industryIdentifiers": [
      {
        "type": string,
        "identifier": string
      },
      {
        "type": string,
        "identifier": string
      }
    ],
    "pageCount": number,
    "dimensions": {
      "height": string,
      "width": string,
      "thickness": string
    },
    "printType": string,
    "mainCategory": string,
    "categories": string[],
    "averageRating": number,
    "ratingsCount": number,
    "contentVersion": string,
    "imageLinks"?: {
      "smallThumbnail": string,
      "thumbnail": string,
      "small": string,
      "medium": string,
      "large": string,
      "extraLarge": string
    },
    "language": string,
    "infoLink": string,
    "canonicalVolumeLink": string
  }
}

export interface SerieCatalogoInterface {
  backdrop_path: string,
  id: number,
  name: string,
  overview: string,
  poster_path: string,
  vote_average: number,
  popularity: number,
  complete?: CompleteSerie,
  getComplete(): void
}

export type CompleteSerie = {
  "backdrop_path": string,
  "created_by": [
    {
      "id": number,
      "credit_id": string,
      "name": string,
      "gender": number,
      "profile_path": string
    },
  ],
  "episode_run_time": number[],
  "first_air_date": string,
  "genres": [
    {
      "id": number,
      "name": string
    },
  ],
  "homepage": string,
  "id": number,
  "in_production": boolean,
  "languages": string[],
  "last_air_date": string,
  "last_episode_to_air": {
    "air_date": string,
    "episode_number": number,
    "id": number,
    "name": string,
    "overview": string,
    "production_code": string,
    "season_number": number,
    "still_path": string,
    "vote_average": number,
    "vote_count": number
  },
  "name": string,
  "next_episode_to_air": string,
  "networks": [
    {
      "name": string,
      "id": number,
      "logo_path": string,
      "origin_country": string
    }
  ],
  "number_of_episodes": number,
  "number_of_seasons": number,
  "origin_country": string[],
  "original_language": string,
  "original_name": string,
  "overview": string,
  "popularity": number,
  "poster_path": string,
  "production_companies": [
    {
      "id": number,
      "logo_path": string,
      "name": string,
      "origin_country": string
    }
  ],
  "production_countries": [
    {
      "iso_3166_1": string,
      "name": string
    },
  ],
  "seasons": [
    {
      "air_date": string,
      "episode_count": number,
      "id": number,
      "name": string,
      "overview": string,
      "poster_path": string,
      "season_number": number
    },
  ],
  "spoken_languages": [
    {
      "english_name": string,
      "iso_639_1": string,
      "name": string
    }
  ],
  "status": string,
  "tagline": string,
  "type": string,
  "vote_average": number,
  "vote_count": number
}

export type search = 'ANIME' | 'SERIE' | 'BOOK'

export interface UserInterface {
  uid?: string,
  username: string,
  createdAt?: Date,
  updatedAt?: Date,
  myList: firebase.default.firestore.DocumentReference,
  friends: friends[],
  notifications: notification[]
}

export interface notification {
  type: string,
  message: string
}
export interface friends {
  user: firebase.default.firestore.DocumentReference
  listRecomendation: firebase.default.firestore.DocumentReference
}

export interface listInterface {
  uid?: string
  anime: content<contentAnime>[],
  serie: content<contentSerie>[],
  book: content<contentBook>[]
  createdAt: Date

}

export interface contentAnime {
  epStoped: number
}

export interface contentBook {
  season: number, epStoped: number
}

export interface contentSerie {
  pageStoped: number
}

export interface content<T> {
  "contentId": string | number, // id da api
  "contentType": search,
  "myrating"?: number,
  "createdAt"?: Date, // timestamp
  "updatedAt"?: Date,
  "watched": boolean
}