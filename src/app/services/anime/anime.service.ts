import { Injectable } from '@angular/core';
import axios from 'axios';
import { CatalogoAnime } from 'src/app/data/interfaces';


@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor() { }

  async getHomeCatalogo(){
    let catalogo = await axios.get("https://api.jikan.moe/v3/search/anime?q=&page=1&order_by=start_date&sort=desc&limit=5")
    return catalogo.data.results as CatalogoAnime[]
  }

  async search(query : string, isAll = false){
    const limit = isAll ? 3 : 9
    try{
      let result = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${query}&limit=${limit}`)
      return result.data.results as CatalogoAnime[]
    } catch (e) {
      console.error(e)
      throw "Error"
    }
  }
}
