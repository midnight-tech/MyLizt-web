import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { content, contentAnime, contentBook, contentSerie, listInterface, search, UserInterface } from 'src/app/data/interfaces';
import { List } from 'src/app/data/List';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ListService {

    private myList?: List

    constructor(public auth: AuthenticationService,
        public fire: AngularFirestore) {
    }

    async getMyList() {
        const myUser = this.auth.userFirestore!!
        if (this.myList) {
            return this.myList
        }
        const data = await myUser.myList.get()
        this.myList = new List({ ...data.data() as listInterface, uid: data.id }, this)
        return this.myList
    }


    async getUserList(userId: string) {
        throw "Not Implemented"
    }

    async contentInMyList(id: string | number, type: search) {
        if(type == "ANIME"){
            let animeQuery = await this.auth.userFirestore?.myList.collection('anime').doc(id.toString()).get()
            return animeQuery?.exists!!
        } else if (type == 'BOOK'){
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
        let anime = animeQuery?.docs.map((value)=>{
            return value.data() as content<contentAnime>
        })
        let book = bookQuery?.docs.map((value)=>{
            return value.data() as content<contentBook>
        })
        let serie = serieQuery?.docs.map((value)=>{
            return value.data() as content<contentSerie>
        })
        return {anime,book,serie}
    }

}
