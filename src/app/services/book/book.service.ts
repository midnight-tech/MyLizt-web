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

}
