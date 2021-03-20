import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor() { }

  async getCatalogo(){
    let catalogo = await axios.get("https://api.jikan.moe/v3/search/anime?q=&page=1&order_by=start_date&sort=desc&limit=5")
    console.log(catalogo)
  }
}
