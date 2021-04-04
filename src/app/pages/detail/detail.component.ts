import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompleteAnime, CompleteBook, CompleteSerie } from 'src/app/data/interfaces';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { SerieService } from 'src/app/services/serie/serie.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  anime?: CompleteAnime
  serie?: CompleteSerie
  book?: CompleteBook


  constructor(private actRoute: ActivatedRoute,
    private animeService: AnimeService,
    private serieService: SerieService,
    private bookService: BookService,
  ) {
    const { type, id } = this.actRoute.snapshot.params
    if (type == 'anime') {
      animeService.getAnimeComplete(id).then((value)=>{
        this.anime = value
        this.ngOnInit()
      })
    }
    else if (type == 'serie') {
      serieService.getSerieComplete(id).then((value)=>{
        this.serie = value
        this.ngOnInit()
      })
    }
    else {
      bookService.getBookComplete(id).then((value)=>{
        this.book = value
        this.ngOnInit()
      })
    }
  }

  ngOnInit() { }
}
