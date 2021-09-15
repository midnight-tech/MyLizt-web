import { Injectable } from '@angular/core';
import axios from 'axios';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { CompleteBook } from 'src/app/data/interfaces';
import { environment } from 'src/environments/environment';
import randomWords from 'random-words'




@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }

  async getHomeCarroussel() {
    type request = {
      items: BookCatalogo[]
    }
    let query = randomWords()
    let books = await axios.get<request>(`https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=relevance&maxResults=5&startIndex=1`)
    return books.data.items.map((value) => {
      value = this.selectImage(value) as BookCatalogo
      return new BookCatalogo(value, this)
    })
  }

  async getCatalogo(page: number = 1) {
    type request = {
      totalItems: number,
      items: BookCatalogo[]
    }
    let query = randomWords()
    const results = await axios.get<request>(`https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=relevance&maxResults=12&startIndex=${(page - 1) * 12}`)
    return {
      content: results.data.items.map((value) => {
        value = this.selectImage(value) as BookCatalogo
        return new BookCatalogo(value, this)
      }),
      lastPage: Math.floor((results.data.totalItems - 1) / 12)
    }
  }

  async partialSearch(query: string, isAll = false) {
    type request = {
      items: BookCatalogo[]
    }
    const limit = isAll ? 9 : 3
    try {
      const result = await axios.get<request>(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${limit}`)
      if (!result.data.items) {
        return []
      }
      return result.data.items.map((value) => {
        value = this.selectImage(value) as BookCatalogo
        return new BookCatalogo(value, this)
      })
    } catch (e) {
      console.error(e)
      throw "Error"
    }
  }

  async search(query: string, page: number = 1) {
    type request = {
      totalItems: number,
      items: BookCatalogo[]
    }
    const results = await axios.get<request>(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12&startIndex=${(page - 1) * 12}`)
    if (!results.data.items) {
      return { content: [], lastPage: 1 }
    }
    return {
      content: results.data.items.map((value) => {
        value = this.selectImage(value) as BookCatalogo
        return new BookCatalogo(value, this)
      }),
      lastPage: Math.floor((results.data.totalItems - 1) / 12)
    }
  }

  async getBookComplete(id: string = "") {
    try {
      const result = await axios.get<CompleteBook>(`https://www.googleapis.com/books/v1/volumes/${id}`)
      let book = this.selectImage(result.data) as CompleteBook
      book.volumeInfo.description = book.volumeInfo.description?.replace(/<\/?[^>]+(>|$)/g, "");
      return book
    }
    catch (e) {
      if (environment.production == false) {
        console.error(e.message)
      }
      throw "Erro ao coletar as informaçoes deste anime"
    }
  }


  selectImage(value: BookCatalogo | CompleteBook) {
    if (!value.volumeInfo.imageLinks) {
      value.volumeInfo.image = './assets/notFoundImage.png'
    } else {
      if (value.volumeInfo.imageLinks.large) {
        value.volumeInfo.image = value.volumeInfo.imageLinks.large
      } else if (value.volumeInfo.imageLinks.medium) {
        value.volumeInfo.image = value.volumeInfo.imageLinks.medium
      } else if (value.volumeInfo.imageLinks.small) {
        value.volumeInfo.image = value.volumeInfo.imageLinks.small
      } else if (value.volumeInfo.imageLinks.thumbnail) {
        value.volumeInfo.image = value.volumeInfo.imageLinks.thumbnail
      } else if (value.volumeInfo.imageLinks.smallThumbnail) {
        value.volumeInfo.image = value.volumeInfo.imageLinks.smallThumbnail
      }
    }
    value.volumeInfo.image = value.volumeInfo.image.replace("http", 'https')
    return value
  }

}
