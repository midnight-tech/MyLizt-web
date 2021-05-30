import { Injectable } from '@angular/core';
import axios from 'axios';
import { CompleteSerie } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SerieService {
  constructor() { }

  async getCarroussel() {
    const series = await axios.get<SerieCatalogo[]>(
      `${environment.url_serie_proxy_base}/api/TMDB/carroussel`
    );
    return series.data.map((serie) => {
      serie = this.setImage(serie) as SerieCatalogo
      return new SerieCatalogo(serie, this);
    });
  }

  async getCatalogo(page: number) {
    type request = {
      content: SerieCatalogo[],
      lastPage: number
    }
    const result = await axios.get<request>(
      `${environment.url_serie_proxy_base}/api/TMDB/catalogo?page=${page}`
    );
    let withImage = result.data.content.map((serie) => {
      serie = this.setImage(serie) as SerieCatalogo
      return new SerieCatalogo(serie, this);
    });
    let pages = [];
    for (let i = 0, j = withImage.length; i < j; i += 12) {
      pages.push(withImage.slice(i, i + 12));
    }
    return { pages, lastPage: result.data.lastPage };
  }

  async partialSearch(query: string, isAll = false) {
    const limit = isAll ? 9 : 3;
    try {
      const result = await axios.get<SerieCatalogo[]>(
        `${environment.url_serie_proxy_base}/api/TMDB/search?q=${query}&limit=${limit}`
      );
      return result.data.map((serie) => {
        serie = this.setImage(serie) as SerieCatalogo
        return new SerieCatalogo(serie, this);
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
      serie = this.setImage(serie) as SerieCatalogo
      return new SerieCatalogo(serie, this);
    });
    let pages = [];
    for (let i = 0, j = withImage.length; i < j; i += 12) {
      pages.push(withImage.slice(i, i + 12));
    }
    return { pages, lastPage: result.data.lastPage };
  }

  async getSerieComplete(id: number = 1) {
    try {
      const result = await axios.get<CompleteSerie>(`${environment.url_serie_proxy_base}/api/TMDB/complete/${id}`)
      let serie = this.setImage(result.data) as CompleteSerie
      return serie
    }
    catch (e) {
      if (environment.production == false) {
        console.error(e.message)
      }
      throw "Erro ao coletar as informaçoes deste anime"
    }
  }

  setImage(value: SerieCatalogo | CompleteSerie) {
    if (value.backdrop_path != null) {
      value.backdrop_path = `https://image.tmdb.org/t/p/original${value.backdrop_path}`;
    } else {
      value.backdrop_path = `./assets/notFoundImage.png`
    }
    if (value.poster_path != null) {
      value.poster_path = `https://image.tmdb.org/t/p/original${value.poster_path}`;
    } else {
      value.poster_path = `./assets/notFoundImage.png`;
    }
    return value
  }

}
