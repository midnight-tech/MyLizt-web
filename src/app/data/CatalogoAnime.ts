import { AnimeService } from '../services/anime/anime.service';
import { CatalogoAnimeInterface, CompleteAnime } from './interfaces'


export class AnimeCatalogo implements CatalogoAnimeInterface {
    mal_id: number;
    image_url: string;
    title: string;
    airing: boolean;
    synopsis: boolean;
    type: string;
    episodes: number;
    score: number;
    start_date: string;
    end_date: string;
    rated?: string;
    complete?: CompleteAnime;

    constructor(data: CatalogoAnimeInterface, private animeService: AnimeService) {
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

    getComplete(){
        this.animeService.getAnimeComplete(this.mal_id).then((value)=>{
            this.complete = value
        })
    }


}