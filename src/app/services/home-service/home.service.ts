import { Injectable } from '@angular/core';
import axios from 'axios';
import { bookCatalogo, CatalogoAnime, search, serieCatalogo } from 'src/app/data/interfaces';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  page = 1
  totalPage = 0;
  results : CatalogoAnime[] | bookCatalogo[] | serieCatalogo[] = []

  constructor(
    public animeService : AnimeService,
    public bookService : BookService,
    public serieService : SerieService,
  ) { }
  
  clearContents (){
    this.results = [] as CatalogoAnime[]
    console.log(typeof this.results)
  }

  pageSearch(query : string,page : number = 1,searchType : search){
    switch(searchType){
      case 'ANIME':
        this.animeService.search(query,page).then((value)=>{
          this.results = value.content
          this.totalPage = value.lastPage
        })
        break;
      case 'BOOK':
        this.animeService.search(query,page).then((value)=>{
          this.results = value.content,
          this.totalPage = value.lastPage
        })
        break;
      case 'SERIE':
        break;
    }
  }

}
