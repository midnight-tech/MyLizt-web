import { Injectable } from '@angular/core';
import axios from 'axios';
import { serieCatalogo } from 'src/app/data/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SerieService {

  constructor() {

  }

  async getHomeCatalogo() {
    const series = await axios.get(`${environment.url_serie_proxy_base}/api/TMDB/catalogo`)
    const filter: serieCatalogo[] = series.data
    return filter.map((serie) => {
      serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`
      return serie
    })
  }

  async search(query: string, isAll = false) {
    const limit = isAll ? 9 : 3
    try{
    const result = await axios.get(`${environment.url_serie_proxy_base}/api/TMDB/search?q=${query}&limit=${limit}`)
    return result.data.map((serie: serieCatalogo) => {
      serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`
      return serie
    }) as serieCatalogo[]
    } catch(e){
      console.error(e)
      throw "Error"
    }
  }
}
