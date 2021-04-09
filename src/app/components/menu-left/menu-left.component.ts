import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompleteAnime, CompleteBook, CompleteSerie } from 'src/app/data/interfaces';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { ListService } from 'src/app/services/list/list.service';
import { SerieService } from 'src/app/services/serie/serie.service';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit {
  
  anime: CompleteAnime[] = []
  serie: CompleteSerie[] = []
  book: CompleteBook[] = []

  constructor(
    private listService: ListService,
    private animeService: AnimeService,
    private bookService: BookService,
    private serieService: SerieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getContents()
  }

  getContents() {
    this.listService.getHomeContent().then(({ anime, book, serie }) => {
      let result = 0
      let index = 0
      for (let i of anime!!) {
        this.animeService.getAnimeComplete(i.contentId as number,index).then((value) => {
          this.anime.push(value)
        })
        index += 1
      }

      for (let i of book!!) {
        this.bookService.getBookComplete(i.contentId as string).then((value) => {
          this.book.push(value)
        })
      }
      for (let i of serie!!) {
        this.serieService.getSerieComplete(i.contentId as number).then((value) => {
          this.serie.push(value)
        })
      }
    })

  }

  navigateToDetail(id: string, type: string) {
    this.router.navigate(['home', 'detail', type, id])
  }

  navigateToMyList(type: string) {
    this.router.navigate(['home', 'my-list', type])
  }

}
