import { Injectable } from '@angular/core';
import axios from 'axios';
import { CatalogoAnime } from 'src/app/data/interfaces';


@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor() { }

  async getHomeCatalogo() {
    let catalogo = await axios.get("https://api.jikan.moe/v3/search/anime?q=&page=1&order_by=start_date&sort=desc&limit=5")
    return catalogo.data.results as CatalogoAnime[]
  }

  async partialSearch(query: string, isAll = false) {
    const limit = isAll ? 9 : 3
    try {
      let result = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${query}&limit=${limit}`)
      return result.data.results as CatalogoAnime[]
    } catch (e) {
      console.error(e)
      throw "Error"
    }
  }

  async search(query: string, page: number = 1) {
    const results = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${query}&limit=12&page=${page}`)
    return { content: results.data.results as CatalogoAnime[], lastPage: results.data.last_page }
  }


}
