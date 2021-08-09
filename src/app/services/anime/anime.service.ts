import { Injectable } from '@angular/core';
import axios from 'axios';
import PQueue from 'p-queue/dist';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CompleteAnime } from 'src/app/data/interfaces';
import { environment } from 'src/environments/environment';

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  queue: PQueue;
  constructor() {
    this.queue = new PQueue({ concurrency: 2, interval: 2000, intervalCap: 2 });
  }

  cleanQueue() {
    this.queue.clear();
  }

  async getHomeCarroussel(): Promise<AnimeCatalogo[]> {
    let day = daysOfWeek[new Date(Date.now()).getDay()];

    let catalogo = await this.queue.add(async () =>
      axios.get(`https://api.jikan.moe/v3/schedule/${day}`)
    );

    const loadedCatalogo = catalogo.data[day]
      .map((value: any) => {
        value.airing = true;
        value.start_date = value.airing_start;
        return new AnimeCatalogo(value, this);
      })
      .sort((a: any, b: any) => {
        if (a.score == b.score) return 0;
        if (a.score > b.score) return -1;
        return 1;
      })
      .slice(0, 5);

    return loadedCatalogo
  }

  async getCatalogo(page: number) {
    type request = {
      results: AnimeCatalogo[];
      last_page: number;
    };
    let catalogo = await axios.get<request>(
      `https://api.jikan.moe/v3/search/anime?q=&page=${page}&order_by=start_date&sort=desc&limit=12`
    );
    return {
      anime: catalogo.data.results.map(
        (value) => new AnimeCatalogo(value, this)
      ),
      lastPage: catalogo.data.last_page,
    };
  }

  async partialSearch(query: string, isAll = false) {
    const limit = isAll ? 9 : 3;
    type request = {
      results: AnimeCatalogo[];
    };
    try {
      let result = await axios.get<request>(
        `https://api.jikan.moe/v3/search/anime?q=${query}&limit=${limit}`
      );
      return result.data.results.map((value) => new AnimeCatalogo(value, this));
    } catch (e) {
      console.error(e);
      throw 'Error';
    }
  }

  async search(query: string, page: number = 1) {
    type request = {
      results: AnimeCatalogo[];
      last_page: number;
    };
    const results = await axios.get<request>(
      `https://api.jikan.moe/v3/search/anime?q=${query}&limit=12&page=${page}`
    );
    return {
      content: results.data.results.map(
        (value) => new AnimeCatalogo(value, this)
      ),
      lastPage: results.data.last_page,
    };
  }

  async getAnimeComplete(id: number = 1, index?: number) {
    try {
      const result = await this.queue.add(async () =>
        axios.get<CompleteAnime>(`https://api.jikan.moe/v3/anime/${id}`)
      );
      return result.data;
    } catch (e) {
      if (environment.production == false) {
        console.error(e.message, e.code);
      }
      throw 'Erro ao coletar as informaçoes deste anime';
    }
  }
}
