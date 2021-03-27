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

  async partialSearch(query: string, isAll = false) {
    const limit = isAll ? 9 : 3
    try {
      const result = await axios.get(`${environment.url_serie_proxy_base}/api/TMDB/search?q=${query}&limit=${limit}`)
      return result.data.map((serie: serieCatalogo) => {
        serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`
        return serie
      }) as serieCatalogo[]
    } catch (e) {
      console.error(e)
      throw "Error"
    }
  }

  async search(query: string, page: number = 1) {
    const result = await axios.get(`${environment.url_serie_proxy_base}/api/TMDB/complete_search?q=${query}&page=${page}`)
    let pages : serieCatalogo[][] = []
    let withImage = result.data.content.map((serie: serieCatalogo) => {
      serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`
      return serie
    }) as serieCatalogo[]
    for (let i = 0, j = withImage.length; i < j; i += 12) {
      pages.push(result.data.content.slice(i, i + 12))
    }
    return { pages, lastPage: result.data.lastPage }
  }
}
