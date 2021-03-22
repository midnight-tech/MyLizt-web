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
}
