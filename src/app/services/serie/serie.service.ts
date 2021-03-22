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

  async getHomeCatalogo(){
    const series = await axios.get(`${environment.url_serie_proxy_base}/api/TMDB/catalogo`)
    const filter : serieCatalogo[] = series.data.results.slice(0,5)
    return filter.map((serie)=>{
      serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`
      return serie
    })
  }

}
