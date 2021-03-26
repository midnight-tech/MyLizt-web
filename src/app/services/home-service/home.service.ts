import { Injectable } from '@angular/core';
import { bookCatalogo, CatalogoAnime, search, serieCatalogo } from 'src/app/data/interfaces';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  page = 1
  results : CatalogoAnime[] | bookCatalogo[] | serieCatalogo[] = []

  constructor(
    animeService : AnimeService,
    bookService : BookService,
    serieService : SerieService,
  ) { }


  pageSearch(query : string,page : number,searchType : search){
    switch(searchType){
      case 'ANIME':
        break;
      case 'BOOK':
        break;
      case 'SERIE':
        break;
    }
  }

}
