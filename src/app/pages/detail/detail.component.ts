import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CompleteAnime,
  CompleteBook,
  CompleteSerie,
} from 'src/app/data/interfaces';
import { AnimeService } from 'src/app/services/anime/anime.service';
import { BookService } from 'src/app/services/book/book.service';
import { SerieService } from 'src/app/services/serie/serie.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  anime?: CompleteAnime;
  serie?: CompleteSerie;
  book?: CompleteBook;
  season = 0;

  constructor(
    private actRoute: ActivatedRoute,
    private animeService: AnimeService,
    private serieService: SerieService,
    private bookService: BookService,
  ) {
    this.actRoute.params.subscribe((value) => {
      const { type, id } = value;
      this.anime = undefined;
      this.serie = undefined;
      this.book = undefined;
      if (type == 'anime') {
        animeService.getAnimeComplete(id).then((value) => {
          this.anime = value;
        });
      } else if (type == 'serie') {
        serieService.getSerieComplete(id).then((value) => {
          this.serie = value;
        });
      } else {
        bookService.getBookComplete(id).then((value) => {
          this.book = value;
        });
      }
    });
  }

  setIndexSerie(index: number) {
    this.season = index;
  }

  ngOnInit() { }
}
