import { Injectable } from '@angular/core';
import axios from 'axios';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { BookCatalogoInterface, CompleteBook } from 'src/app/data/interfaces';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }

  async getHomeCatalogo() {
    type request = {
      items: BookCatalogo[]
    }

    let books = await axios.get<request>("https://www.googleapis.com/books/v1/volumes?q=a&orderBy=newest&maxResults=5&startIndex=1")
    return books.data.items.map((value) => new BookCatalogo(value, this))
  }

  async partialSearch(query: string, isAll = false) {
    type request = {
      items: BookCatalogo[]
    }
    const limit = isAll ? 9 : 3
    try {
      const result = await axios.get<request>(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${limit}`)
      return result.data.items.map((value) => new BookCatalogo(value, this))
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
    return {
      content: results.data.items.map((value) => new BookCatalogo(value, this)),
      lastPage: Math.floor((results.data.totalItems - 1) / 12)
    }
  }

  async getBookComplete(id: string = "") {
    try {
      const result = await axios.get<CompleteBook>(`https://www.googleapis.com/books/v1/volumes/${id}`)
      return result.data
    }
    catch (e) {
      if (environment.production == false) {
        console.error(e.message)
      }
      throw "Erro ao coletar as informaçoes deste anime"
    }
  }

}
