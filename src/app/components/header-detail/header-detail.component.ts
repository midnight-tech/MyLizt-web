import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  CompleteAnime,
  CompleteBook,
  CompleteSerie,
  content,
  search,
} from 'src/app/data/interfaces';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-header-detail',
  templateUrl: './header-detail.component.html',
  styleUrls: ['./header-detail.component.scss'],
})
export class HeaderDetailComponent implements OnInit {
  @Input() anime!: CompleteAnime;
  @Input() serie!: CompleteSerie;
  @Input() book!: CompleteBook;
  @Input() type!: search;
  @Input() watched!: boolean;
  @Output() seasonAtualEmitter = new EventEmitter<number>();

  openCompleteWatched = false;
  rateInputControl = new FormControl('');
  episodeInputControl = new FormControl('');
  mycontent?: content;
  rateInput = false;
  markInput = false;

  seasonAtual = 0;

  isActiveRecommend = false;

  onMyList: boolean = false;
  updateState = false;

  constructor(private listService: ListService) {
    this.seasonAtualEmitter.subscribe((value) => {
      this.seasonAtual = value;
    });
  }

  changeRateInput() {
    if (this.rateInput == false) {
      this.rateInputControl.setValue(this.mycontent?.myrating || 'N/A');
    }
    this.rateInput = !this.rateInput;
  }

  setRate() {
    this.changeRateInput();
    if (this.rateInputControl.value.length == 0) {
      // deletar a nota eu acho
      return;
    }
    let value = Number.parseFloat(this.rateInputControl.value);
    if (Number.isNaN(value)) {
      // caso usuario consigar por algo que não seja numero
      return;
    }
    if (value > 10.0 || value < 0) {
      // limitadores de valor
      return;
    }
    if (value == this.mycontent?.myrating) {
      // não alterou a nota
      return;
    }

    this.listService
      .alterMyRating(this.mycontent!.ref!, value)
      .then((valueRet) => {
        this.mycontent = valueRet.data();
        this.mycontent!.ref = valueRet.ref;
      });
  }

  ngOnInit() {
    this.isItInMyList();
    if (this.type == 'SERIE') {
      this.seasonAtualEmitter.emit(0);
      return;
    }
  }

  changeSeason(season: number) {
    if (season >= 0 && season <= this.serie.number_of_seasons) {
      this.seasonAtualEmitter.emit(season);
    }
  }

  addToMyListFromRecommendation() {
    if (this.mycontent == undefined) {
      return;
    }
    let contentCopy = this.mycontent;
    contentCopy.recommended = null;
    this.listService
      .editContent(contentCopy, true, true)
      .then((value) => {
        this.mycontent = value;
      });
  }

  isItInMyList() {
    let id
    if (this.type == 'ANIME') {
      id = this.anime.mal_id
    } else if (this.type == 'SERIE') {
      id = this.serie.id
    } else {
      id = this.book.id
    }
    this.listService
      .contentInMyList(id, this.type)
      .then((value) => {
        this.onMyList = value.exists;
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
  }

  addToMyList() {
    let id
    if (this.type == 'ANIME') {
      id = this.anime.mal_id
    } else if (this.type == 'SERIE') {
      id = this.serie.id
    } else {
      id = this.book.id
    }
    this.listService.addContent(id, this.type).then(() => {
      this.isItInMyList();
    });

  }

  deleteToMyList() {
    if (this.mycontent == undefined) {
      throw 'myContent undefined';
    }
    this.listService.removeFromList(this.mycontent).then(() => {
      this.isItInMyList();
    });

  }

  disableReceiveRecommendation(value: boolean) {
    this.isActiveRecommend = value;
  }

  serieEpisodeWatched() {
    if (this.mycontent!.season == this.seasonAtual) {
      return this.mycontent!.mark!;
    }
    if (this.mycontent!.season! > this.seasonAtual) {
      return this.serie.seasons[this.seasonAtual].episode_count;
    }
    return 0;
  }

  changeEpisode(episode?: number) {
    let value: number;
    if (episode != undefined) {
      value = episode;
    } else {
      this.changeMarkInput();
      if (this.episodeInputControl.value.length == 0) {
        return;
      }
      value = Number.parseFloat(this.episodeInputControl.value);
    }
    if (Number.isNaN(value) || Number.isInteger(value) == false) {
      // Usuario inseriu algo que não é um numero ou um numero inteiro
      return;
    }
    if (value < 0) {
      // valor negativo
      return;
    }
    if (this.type == 'SERIE') {
      // serie por causa das temporadas precisa de uma tratativa diferente
      if (
        this.mycontent?.season == this.serie.seasons.length - 1 &&
        this.mycontent.mark ==
        this.serie.seasons[this.mycontent.season].episode_count
      ) {
        this.openCompleteWatched = true;
        return;
      }
      if (
        value == this.mycontent?.mark &&
        this.seasonAtual == this.mycontent.season
      ) {
        // usuario não alterou os campos
        return;
      }
      if (value > this.serie.seasons[this.seasonAtual].episode_count) {
        // não fazer nada, episodio acima do limite da temporada
        return;
      }

      let contentCopy = this.mycontent!;
      contentCopy.mark = value;
      contentCopy.season = this.seasonAtual;
      contentCopy.watched = false;
      this.listService.editContent(contentCopy).then((value) => {
        this.mycontent = value;
        if (
          this.mycontent.season == this.serie.seasons.length - 1 &&
          this.mycontent.mark ==
          this.serie.seasons[this.mycontent.season].episode_count
        ) {
          this.openCompleteWatched = true;
        }
      });
      return;
    }

    if (
      (this.mycontent?.mark == this.anime?.episodes &&
        value > this.anime?.episodes) ||
      (this.mycontent?.mark == this.book?.volumeInfo.pageCount &&
        value > this.anime?.episodes)
    ) {
      this.openCompleteWatched = true;
      return;
    }
    // tratativas livros e anime
    if (value == this.mycontent?.mark) {
      // Não fazer nada livro serie
      return;
    }

    if (this.anime && value > this.anime.episodes) {
      // Não fazer nada, é um anime e o episodio acima do limite
      return;
    }
    if (this.book && value > this.book.volumeInfo.pageCount) {
      // Não fazer nada, é um livro e a pagina acima do limite
      return;
    }

    let contentCopy = this.mycontent!;
    contentCopy.mark = value;
    contentCopy.watched = false;
    this.listService.editContent(contentCopy).then((value) => {
      this.mycontent = value;
      if (
        this.mycontent.mark == this.anime?.episodes ||
        this.mycontent.mark == this.book?.volumeInfo.pageCount
      ) {
        this.openCompleteWatched = true;
      }
    });
  }

  changeMarkInput() {
    if (this.markInput == false) {
      this.episodeInputControl.setValue(this.mycontent!.mark || 0);
    }
    this.markInput = !this.markInput;
  }
}
