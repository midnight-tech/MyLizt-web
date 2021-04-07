import { environment } from "src/environments/environment";
import { SerieService } from "../services/serie/serie.service";
import { CompleteSerie, SerieCatalogoInterface } from "./interfaces";

export class SerieCatalogo implements SerieCatalogoInterface {
    backdrop_path: string;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    popularity: number;
    complete?: CompleteSerie;
    private functionCalled = false

    constructor(data?: SerieCatalogoInterface, public serieService?: SerieService, serieComplete? : CompleteSerie) {
        if(data){
            if(!serieService){
                throw "Sem serie service"
            }
            this.backdrop_path = data.backdrop_path
            this.id = data.id
            this.name = data.name
            this.overview = data.overview
            this.poster_path = data.poster_path
            this.vote_average = data.vote_average
            this.popularity = data.popularity
            this.complete = data.complete
        } else if (serieComplete){
            this.backdrop_path = serieComplete.backdrop_path
            this.id = serieComplete.id
            this.name = serieComplete.name
            this.overview = serieComplete.overview
            this.poster_path = serieComplete.poster_path
            this.vote_average = serieComplete.vote_average
            this.popularity = serieComplete.popularity
            this.complete = serieComplete
        } else {
            throw "Todos elementos não setados "
        }

    }

    getComplete() {
        if (this.functionCalled == false) {
            this.functionCalled = true
            if (!this.complete) {
                this.serieService!!.getSerieComplete(this.id).then((value) => {
                    this.complete = value
                    this.functionCalled = false
                }).catch((error)=>{
                    if(environment.production == false){
                        console.log(error)
                    }
                }).finally(()=>{
                    this.functionCalled = false
                })
            }
            
        }
    }

}