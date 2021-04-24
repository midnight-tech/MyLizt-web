import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { content } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { HomeContextService } from 'src/app/services/home-context/home.service';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() anime?: AnimeCatalogo;
  @Input() serie?: SerieCatalogo;
  @Input() book?: BookCatalogo;
  @Input() lookMyList: boolean = true;
  @Input() pageCall? : 'myList' | 'recommendation' | 'friendList' | 'other' = 'other'
  @Input() friendContent? : content
  inMyList: boolean = false;
  mycontent?: content;
  

  notRended = true;

  isActiveRecommend = false;

  constructor(
    public listService: ListService,
    public router: Router,
    public homeContext: HomeContextService
  ) {}

  ngOnInit() {
    if(this.pageCall == undefined){
      throw "pageCall in card can not be undefined"
    }
    if(this.pageCall == 'friendList'){
      if(this.friendContent == undefined){
        throw "friendContent undefined"
      }
    }
    if (this.notRended) {
      if (this.lookMyList) {
        this.isInMyList();
      } else {
        this.inMyList = true;
        this.getContent();
      }
      this.notRended = false;
    }
  }

  getContent() {
    if (this.anime) {
      this.listService
        .contentInMyList(this.anime.mal_id, 'ANIME')
        .then((value) => {
          if (value.exists) {
            this.mycontent = value.data()!;
            this.mycontent.ref = value.ref;
          }
        });
    } else if (this.book) {
      this.listService.contentInMyList(this.book.id, 'BOOK').then((value) => {
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    } else if (this.serie) {
      this.listService.contentInMyList(this.serie.id, 'SERIE').then((value) => {
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    }
  }

  addToMyList() {
    if (this.anime) {
      this.listService.addContent(this.anime.mal_id, 'ANIME').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    } else if (this.book) {
      this.listService.addContent(this.book.id, 'BOOK').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    } else if (this.serie) {
      this.listService.addContent(this.serie.id, 'SERIE').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    }
  }

  deleteToMyList() {
    if (this.anime) {
      this.listService
        .removeFromList(this.anime.mal_id.toString(), 'anime')
        .then(() => {
          this.notRended = true;
          this.ngOnInit();
        });
    } else if (this.book) {
      this.listService.removeFromList(this.book.id, 'book').then(() => {
        this.notRended = true;
        this.ngOnInit();
      });
    } else if (this.serie) {
      this.listService
        .removeFromList(this.serie.id.toString(), 'serie')
        .then(() => {
          this.notRended = true;
          this.ngOnInit();
        });
    }
  }

  isInMyList() {
    if (this.anime) {
      this.listService
        .contentInMyList(this.anime.mal_id, 'ANIME')
        .then((value) => {
          this.inMyList = value.exists;
          if (value.exists) {
            this.mycontent = value.data()!;
            this.mycontent.ref = value.ref;
          }
        });
    } else if (this.book) {
      this.listService.contentInMyList(this.book.id, 'BOOK').then((value) => {
        this.inMyList = value.exists;
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    } else if (this.serie) {
      this.listService.contentInMyList(this.serie.id, 'SERIE').then((value) => {
        this.inMyList = value.exists;
        if (value.exists) {
          this.mycontent = value.data()!;
          this.mycontent.ref = value.ref;
        }
      });
    }
  }

  navigateToDetail() {
    if (this.anime) {
      this.router.navigate(['home', 'detail', 'anime', this.anime.mal_id]);
    } else if (this.book) {
      this.router.navigate(['home', 'detail', 'book', this.book.id]);
    } else if (this.serie) {
      this.router.navigate(['home', 'detail', 'serie', this.serie.id]);
    }
  }

  disableReceiveRecommendation(value: boolean) {
    this.isActiveRecommend = value;
  }

  // changeEpisode(episode: number) {
  //   let value = episode;
  //   if (Number.isNaN(value) || Number.isInteger(value) == false) {
  //     // Usuario inseriu algo que não é um numero ou um numero inteiro
  //     return;
  //   }
  //   if (value < 0) {
  //     // valor negativo
  //     return;
  //   }
  //   if (this.serie && this.serie.complete && this.mycontent && this.mycontent.season) {
  //     // serie por causa das temporadas precisa de uma tratativa diferente
  //     if (value == this.mycontent?.mark) {
  //       // usuario não alterou os campos
  //       return;
  //     }
  //     if (value > this.serie.complete.seasons[this.mycontent.season].episode_count) {
  //       // não fazer nada, episodio acima do limite da temporada
  //       return;
  //     }

  //     let contentCopy = this.mycontent!;
  //     contentCopy.mark = value;
  //     this.listService.setContentStopped(contentCopy).then((value) => {
  //       this.mycontent = value;
  //     });
  //     return;
  //   }
  //   // tratativas livros e anime
  //   if (value == this.mycontent?.mark) {
  //     // Não fazer nada livro serie
  //     return;
  //   }

  //   if (this.anime && value > this.anime.episodes) {
  //     // Não fazer nada, é um anime e o episodio acima do limite
  //     return;
  //   }
  //   if (this.book && value > this.book.complete.volumeInfo.pageCount) {
  //     // Não fazer nada, é um livro e a pagina acima do limite
  //     return;
  //   }

  //   let contentCopy = this.mycontent!;
  //   contentCopy.mark = value;
  //   this.listService.setContentStopped(contentCopy).then((value) => {
  //     this.mycontent = value;
  //   });
  // }
}
