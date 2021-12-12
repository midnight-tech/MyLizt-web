import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
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
import { PopUpComponent } from '../pop-up/pop-up.component';

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
  @ViewChild("popUpHeaderDetail") popUp?: PopUpComponent

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

  ngOnInit() {
    this.isItInMyList();
    if (this.type == 'SERIE') {
      this.seasonAtualEmitter.emit(0);
      return;
    }
  }

  async copyToClipBoard() {
    let title = "";
    if (this.anime) title = this.anime.title
    else if (this.serie) title = this.serie.name
    else title = this.book.volumeInfo.title
    try {
      await navigator.clipboard.writeText(title)
      this.popUp?.showPopUp("text copied to clipboard")
    } catch (e) {
    }
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
          if (this.type == 'SERIE') {
            this.seasonAtual = this.mycontent.season ?? 0
          }
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
    if (this.isUserHasInsertedNumber(value)) {
      return;
    }
    if (value < 0) {
      return;
    }
    if (this.type == 'SERIE') {
      this.setEpisodeAndSeasonInSerie(value)
      return;
    }
    this.setAnimeEpisodeOrBookPage(value)
  }

  setAnimeEpisodeOrBookPage(mark_number: number) {
    if (this.isLastEpisodeAnime(mark_number) || this.isLastBookPage(mark_number)) {
      this.openCompleteWatched = true;
      return;
    }
    if (mark_number == this.mycontent?.mark) {
      return;
    }

    if (this.isAnimeEpisodeInValidRange(mark_number)) {
      return;
    }
    if (this.isBookPageInValidRange(mark_number)) {
      return;
    }

    let contentCopy = this.mycontent!;
    contentCopy.mark = mark_number;
    contentCopy.watched = false;
    this.listService.editContent(contentCopy).then((newContent) => {
      this.mycontent = newContent;
      if (
        this.mycontent.mark == this.anime?.episodes ||
        this.mycontent.mark == this.book?.volumeInfo.pageCount
      ) {
        this.openCompleteWatched = true;
      }
    });
  }

  isAnimeEpisodeInValidRange(episode: number) {
    return this.anime && this.anime.episodes && episode > this.anime.episodes
  }

  isBookPageInValidRange(page: number) {
    return this.book && page > this.book.volumeInfo.pageCount;
  }

  isLastEpisodeAnime(episode: number) {
    return this.mycontent?.mark == this.anime?.episodes && episode > this.anime?.episodes
  }

  isLastBookPage(page: number) {
    return this.mycontent?.mark == this.book?.volumeInfo.pageCount &&
      page > this.book?.volumeInfo.pageCount
  }

  isUserHasInsertedNumber(episode: number) {
    return Number.isNaN(episode) || Number.isInteger(episode) == false
  }

  setEpisodeAndSeasonInSerie(markNumberSerie: number) {
    if (
      this.isLastEpisodeOfSerie(markNumberSerie)
    ) {
      this.openCompleteWatched = true;
      return;
    }
    if (this.isUserNotChangedMarkFieldOfSerie(markNumberSerie)) {
      return;
    }
    if (markNumberSerie > this.serie.seasons[this.seasonAtual].episode_count) {
      return;
    }

    let contentCopy = this.mycontent!;
    contentCopy.mark = markNumberSerie;
    contentCopy.season = this.seasonAtual;
    contentCopy.watched = false;
    this.listService.editContent(contentCopy).then((value) => {
      this.mycontent = value;
      if (this.isLastEpisodeOfSerie(markNumberSerie)) {
        this.openCompleteWatched = true;
      }
    });
  }

  isUserNotChangedMarkFieldOfSerie(mark: number) {
    return mark == this.mycontent?.mark && this.seasonAtual == this.mycontent.season
  }

  isLastEpisodeOfSerie(episode: number) {
    return this.mycontent?.season == this.serie.seasons.length - 1 &&
      this.mycontent.mark == this.serie.seasons[this.mycontent.season].episode_count &&
      episode >= this.serie.seasons[this.mycontent.season].episode_count
  }

  changeMarkInput() {
    if (this.markInput == false) {
      this.episodeInputControl.setValue(this.mycontent!.mark || 0);
    }
    this.markInput = !this.markInput;
  }
}
