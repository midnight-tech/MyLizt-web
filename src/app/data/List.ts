import { ListService } from "../services/list/list.service";
import { listInterface } from "./interfaces"
import firebase from 'firebase/app'

export class List implements listInterface {
    uid?: string | undefined;
    createdAt: Date
    anime: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
    serie: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
    book: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>

    constructor(data: listInterface, private listService: ListService) {
        this.uid = data.uid
        this.anime = data.anime
        this.serie = data.serie
        this.book = data.book
        this.createdAt = data.createdAt
    }

}