import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

    async contentInMyList (id: string| number,type: search){
        const myList = await this.getMyList()
        if(type == 'ANIME'){
            return myList.anime.find((value)=>{
                return value.contentId == id
            }) == undefined
        } else if (type == 'BOOK'){
            return myList.book.find((value)=>{
                return value.contentId == id
            }) == undefined
        } else {
            return myList.serie.find((value)=>{
                return value.contentId == id
            }) == undefined
        }
    }

    async addContent(id: string| number, type : search) {
        if(type == 'ANIME'){
            this.myList?.anime.push({
                contentId: id as number,
                contentType: type,
                watched : false,
                createdAt: new Date(Date.now())
            })
            this.auth.userFirestore?.myList.update({anime: this.myList!!.anime})
        } else if (type == 'BOOK'){
            this.myList?.book.push({
                contentId: id as string,
                contentType: type,
                watched : false,
                createdAt: new Date(Date.now())
            })
            this.auth.userFirestore?.myList.update({book: this.myList!!.book})
        } else {
            this.myList?.serie.push({
                contentId: id as number,
                contentType: type,
                watched : false,
                createdAt: new Date(Date.now())
            })
            this.auth.userFirestore?.myList.update({serie: this.myList!!.serie})
        } 
    }

    async removeFromList() {

    }

    async updateOneContent() {

    }

    async getMyListHomeScreen() {

    }

    async getHomeContent(){
        const myList = await this.getMyList()
        return {
            anime: myList.anime.slice(0,5),
            book : myList.book.slice(0,5),
            serie : myList.serie.slice(0,5)
        }
    }

}
