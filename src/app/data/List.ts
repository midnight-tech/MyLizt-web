import { CollectionReference, DocumentData } from "@angular/fire/firestore";
import { ListService } from "../services/list/list.service";
import { listInterface } from "./interfaces"

export class List implements listInterface {
    uid?: string | undefined;
    createdAt: Date
    anime: CollectionReference<DocumentData>
    serie: CollectionReference<DocumentData>
    book: CollectionReference<DocumentData>

    constructor(data: listInterface, private listService: ListService) {
        this.uid = data.uid
        this.anime = data.anime
        this.serie = data.serie
        this.book = data.book
        this.createdAt = data.createdAt
    }

}