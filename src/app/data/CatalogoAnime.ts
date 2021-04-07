import { environment } from 'src/environments/environment';
import { AnimeService } from '../services/anime/anime.service';
import { CatalogoAnimeInterface, CompleteAnime } from './interfaces'


export class AnimeCatalogo implements CatalogoAnimeInterface {
    mal_id: number;
    image_url: string;
    title: string;
    airing: boolean;
    synopsis: string;
    type: string;
    episodes: number;
    score: number;
    start_date: string;
    end_date: string;
    rated?: string;
    complete?: CompleteAnime;
    private functionCalled = false

    constructor(data?: CatalogoAnimeInterface, private animeService?: AnimeService, completeAnime?: CompleteAnime) {
        if (data) {
            if (!animeService) {
                throw "anime service"
            }
            this.mal_id = data.mal_id
            this.image_url = data.image_url
            this.title = data.title;
            this.airing = data.airing;
            this.synopsis = data.synopsis;
            this.type = data.type;
            this.episodes = data.episodes;
            this.score = data.score;
            this.start_date = data.start_date;
            this.end_date = data.end_date;
            this.rated = data.rated;
            this.complete = data.complete;
        }
        else if (completeAnime) {
            this.mal_id = completeAnime.mal_id
            this.image_url = completeAnime.image_url
            this.title = completeAnime.title
            this.airing = completeAnime.airing
            this.synopsis = completeAnime.synopsis
            this.type = completeAnime.type
            this.episodes = completeAnime.episodes
            this.score = completeAnime.score
            this.start_date = completeAnime.aired.from
            this.end_date = completeAnime.aired.to
            this.rated = completeAnime.rating
            this.complete = completeAnime
        } else {
            throw "sem data ou animeComplete"
        }
    }

    getComplete() {
        if (this.functionCalled == false) {
            this.functionCalled = true
            if (!this.complete) {
                this.animeService!!.getAnimeComplete(this.mal_id).then((value) => {
                    this.complete = value
                    this.functionCalled = false
                }).catch((error) => {
                    if (environment.production == false) {
                        console.log(error)
                    }
                }).finally(() => {
                    this.functionCalled = false
                })
            }
        }
    }


}