import { Injectable } from '@angular/core';
import axios from 'axios';
import { CompleteSerie, SerieCatalogoInterface } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SerieService {
  constructor() { }

  async getHomeCatalogo() {
    const series = await axios.get<SerieCatalogo[]>(
      `${environment.url_serie_proxy_base}/api/TMDB/catalogo`
    );
    return series.data.map((serie) => {
      serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`;
      return new SerieCatalogo(serie,this);
    });
  }

  async partialSearch(query: string, isAll = false) {
    const limit = isAll ? 9 : 3;
    try {
      const result = await axios.get<SerieCatalogo[]>(
        `${environment.url_serie_proxy_base}/api/TMDB/search?q=${query}&limit=${limit}`
      );
      return result.data.map((serie) => {
        if (serie.backdrop_path != null) {
          serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`;
        }
        return new SerieCatalogo(serie,this);
      });
    } catch (e) {
      console.error(e);
      throw 'Error';
    }
  }

  async search(query: string, page: number = 1) {
    type request = {
      content: SerieCatalogo[],
      lastPage: number
    }
    const result = await axios.get<request>(
      `${environment.url_serie_proxy_base}/api/TMDB/complete_search?q=${query}&page=${page}`
    );
    let withImage = result.data.content.map((serie) => {
      if (serie.backdrop_path != null) {
        serie.backdrop_path = `https://image.tmdb.org/t/p/original${serie.backdrop_path}`;
      }
      return new SerieCatalogo(serie,this);
    });
    let pages = [];
    for (let i = 0, j = withImage.length; i < j; i += 12) {
      pages.push(withImage.slice(i, i + 12));
    }
    return { pages, lastPage: result.data.lastPage };
  }

  async getSerieComplete(id:number = 1){
    try{
      const result = await axios.get<CompleteSerie>(`${environment.url_serie_proxy_base}/api/TMDB/complete/${id}`)
      if(result.data.backdrop_path != null){
        result.data.backdrop_path = `https://image.tmdb.org/t/p/original${result.data.backdrop_path}`
      }
      return result.data
    }
    catch (e){
      if(environment.production == false){
        console.error(e.message)
      }
      throw "Erro ao coletar as informaçoes deste anime"
    }
  }
}
