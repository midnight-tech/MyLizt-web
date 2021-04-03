import { ListService } from "../services/list/list.service";
import { content, contentAnime, contentBook, contentSerie, listInterface, search } from "./interfaces"

export class List implements listInterface {
    uid?: string | undefined;
    createdAt : Date
    anime : content<contentAnime>[]
    serie : content<contentSerie>[]
    book : content<contentBook>[]

    constructor(data: listInterface, private listService: ListService) {
        this.uid = data.uid
        this.anime = data.anime
        this.serie = data.serie
        this.book = data.book
        this.createdAt = data.createdAt
    }
    
}