import { Injectable } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content, contentAnime, contentBook, contentSerie, listInterface, search } from 'src/app/data/interfaces';
import { List } from 'src/app/data/List';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
    providedIn: 'root'
})
export class ListService {

    private myList?: List

    constructor(
        private auth: AuthenticationService,
        private animeService: AnimeService,
        private serieService: SerieService,
        private BookService: BookService,
    ) { }

    async getMyList() {
        const myUser = this.auth.userFirestore!!
        if (this.myList) {
            return this.myList
        }
        const data = await myUser.myList.get({})
        this.myList = new List({ ...data.data() as listInterface, uid: data.id }, this)
        return this.myList
    }


    async getUserList(userId: string) {
        throw "Not Implemented"
    }

    async contentInMyList(id: string | number, type: search) {
        if (type == "ANIME") {
            let animeQuery = await this.auth.userFirestore?.myList.collection('anime').doc(id.toString()).get()
            return animeQuery?.exists!!
        } else if (type == 'BOOK') {
            let bookQuery = await this.auth.userFirestore?.myList.collection('book').doc(id.toString()).get()
            return bookQuery?.exists!!
        } else {
            let serieQuery = await this.auth.userFirestore?.myList.collection('serie').doc(id.toString()).get()
            return serieQuery?.exists!!
        }
    }

    async addContent(id: string | number, type: search) {
        if (type == 'ANIME') {
            this.auth.userFirestore?.myList.collection('anime').doc(id.toString()).set({
                contentId: id as string,
                contentType: type,
                watched: false,
                createdAt: new Date(Date.now())
            })
        } else if (type == 'BOOK') {
            this.auth.userFirestore?.myList.collection('book').doc(id.toString()).set({
                contentId: id as string,
                contentType: type,
                watched: false,
                createdAt: new Date(Date.now())
            })
        } else {
            this.auth.userFirestore?.myList.collection('serie').doc(id.toString()).set({
                contentId: id as string,
                contentType: type,
                watched: false,
                createdAt: new Date(Date.now())
            })
        }
    }

    async getAnimeContent(lastDoc?: DocumentData) {
        let animeQuery: QuerySnapshot<DocumentData>
        if (lastDoc) {
            animeQuery = await this.auth.userFirestore!!.myList.collection('anime').orderBy('watched').startAfter(lastDoc).limit(60).get()
        } else {
            animeQuery = await this.auth.userFirestore!!.myList.collection('anime').orderBy('watched').limit(60).get()
        }
        let finalResult = animeQuery.docs.map(async (animeData,index) => {
            let animeFireResult = animeData.data() as content<contentAnime>
            let animeResult = await this.animeService.getAnimeComplete(animeFireResult.contentId as number,index)

            let animeCatalogo = new AnimeCatalogo(undefined, undefined, animeResult)
            return { anime: animeCatalogo, content: animeFireResult }
        })
        return await Promise.all(finalResult)
    }
    async getAllSerieContent(lastDoc?: DocumentData) {
        let serieQuery: QuerySnapshot<DocumentData>
        if (lastDoc) {
            serieQuery = await this.auth.userFirestore!!.myList.collection('serie').orderBy('watched').startAfter(lastDoc).limit(60).get()
        } else {
            serieQuery = await this.auth.userFirestore!!.myList.collection('serie').orderBy('watched').limit(60).get()
        }
        let finalResult = serieQuery.docs.map(async (serieData) => {
            let serieFireResult = serieData.data() as content<contentSerie>
            let serieResult = await this.serieService.getSerieComplete(serieFireResult.contentId as number)

            let serieCatalogo = new SerieCatalogo(undefined, undefined, serieResult)
            return { serie: serieCatalogo, content: serieFireResult }
        })
        return await Promise.all(finalResult)
    }
    async getAllBookContent(lastDoc?: DocumentData) {
        let bookQuery
        if (lastDoc) {
            bookQuery = await this.auth.userFirestore!!.myList.collection('book').orderBy('watched').startAfter(lastDoc).limit(60).get()
        } else {
            bookQuery = await this.auth.userFirestore!!.myList.collection('book').orderBy('watched').limit(60).get()
        }
        let finalResult = bookQuery.docs.map(async (bookData) => {
            let bookFireResult = bookData.data() as content<contentBook>
            let bookResult = await this.BookService.getBookComplete(bookFireResult.contentId as string)

            let bookCatalogo = new BookCatalogo(undefined, undefined, bookResult)
            return { book: bookCatalogo, content: bookFireResult }
        })
        return await Promise.all(finalResult)
    }

    async removeFromList() {

    }

    async updateOneContent() {

    }

    async getMyListHomeScreen() {

    }

    async getHomeContent() {
        let animeQuery = await this.auth.userFirestore?.myList.collection('anime').limit(5).get()
        let bookQuery = await this.auth.userFirestore?.myList.collection('book').limit(5).get()
        let serieQuery = await this.auth.userFirestore?.myList.collection('serie').limit(5).get()
        let anime = animeQuery?.docs.map((value) => {
            return value.data() as content<contentAnime>
        })
        let book = bookQuery?.docs.map((value) => {
            return value.data() as content<contentBook>
        })
        let serie = serieQuery?.docs.map((value) => {
            return value.data() as content<contentSerie>
        })
        return { anime, book, serie }
    }

}
