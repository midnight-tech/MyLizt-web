import { Injectable } from '@angular/core';
import axios from 'axios';
import { bookCatalogo } from 'src/app/data/interfaces';




@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }

  async getHomeCatalogo() {
    let books = await axios.get("https://www.googleapis.com/books/v1/volumes?q=a&orderBy=newest&maxResults=5&startIndex=1")
    console.log(books.data)
    return books.data.items as bookCatalogo[]
  }

  async partialSearch(query: string, isAll = false) {
    const limit = isAll ? 9 : 3
    try {
      const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${limit}`)
      return result.data.items as bookCatalogo[]
    } catch (e) {
      console.error(e)
      throw "Error"
    }
  }

  async search(query: string, page: number = 1) {
    const results = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12&startIndex=${(page - 1) * 12}`)
    return { content: results.data.items as bookCatalogo[], lastPage: Math.floor((results.data.totalItems - 1) / 12) }
  }

}
