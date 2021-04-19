import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CompleteAnime, CompleteBook, CompleteSerie, content, search } from 'src/app/data/interfaces';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { BookService } from '../book/book.service';
import { ListService } from '../list/list.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root'
})
export class HomeContextService {

  page = 1
  totalPage = 0;
  animeResult: AnimeCatalogo[] = []
  serieResult: SerieCatalogo[] = []
  bookResult: BookCatalogo[] = []
  lastPageSerie: number | null = null
  seriePages: SerieCatalogo[][] = []
  private query = ""
  private searchType?: search = "ANIME"
  private detailContent: CompleteAnime | CompleteSerie | CompleteBook | null

  constructor(
    public animeService: AnimeService,
    public bookService: BookService,
    public serieService: SerieService,
    public listService: ListService
  ) {
    this.detailContent = null
  }

  setDetail(detail: CompleteAnime | CompleteSerie | CompleteBook) {
    this.detailContent = detail
  }

  getDetail() {
    return this.detailContent
  }

  initContent() {
    this.page = 1
    this.totalPage = 0
    this.clearContents()
    this.query = ""
    this.searchType = "ANIME"
    this.lastPageSerie = null
  }

  changePage(page: number, pageCalled: 'search' | 'myContent' | 'friend' | 'catalogo' | 'friendList' | 'myRec' = 'search', type?: search, friendId?: string) {

    switch (pageCalled) {
      case 'search':
        if (page != this.page && page > 0 && page <= this.totalPage) {
          this.pageSearch(this.query, page, this.searchType!!, true)
        }
        return
      case 'myContent':
        if (!type) {
          throw "Query sem type"
        }
        if (page > 0 && (page <= this.totalPage || this.totalPage == 0)) {
          this.myListPage(page, type).then(() => {
            this.page = page
          })
        }
        return
      case 'catalogo':
        if (!type) {
          throw "Query sem type"
        }
        if (page != this.page && page > 0 && (page <= this.totalPage || this.totalPage == 0)) {
          this.pageCatalogo(page, type, true)
        }
        return
      case 'friendList':
        if (!type || !friendId) {
          throw "Query sem type"
        }
        if (page > 0 && (page <= this.totalPage || this.totalPage == 0)) {
          this.friendListPage(page, type.toLowerCase(), friendId).then(() => {
            this.page = page
          })
        }
        return
      case 'myRec':
        if (!type) {
          throw "Query sem type"
        }
        if (page > 0 && (page <= this.totalPage || this.totalPage == 0)) {
          this.MyRecListPage(page, type).then(() => {
            this.page = page
          })
        }
    }
  }

  clearContents() {
    this.animeResult = []
    this.serieResult = []
    this.bookResult = []
  }

  pageSearch(query: string, page: number = 1, searchType: search, pagination = false) {
    if (pagination) {
      this.clearContents()
    } else {
      this.initContent()
    }
    this.page = page
    switch (searchType) {
      case 'ANIME':
        this.animeService.search(query, page).then((value) => {
          this.animeResult = value.content
          this.totalPage = value.lastPage
          this.query = query
          this.searchType = searchType
        })
        break;
      case 'BOOK':
        this.bookService.search(query, page).then((value) => {
          this.bookResult = value.content
          this.totalPage = value.lastPage
          this.query = query
          this.searchType = searchType
          this.page = page

        })
        break;
      case 'SERIE':
        this.seriePageManager(query, page).then(() => {
          this.searchType = searchType
          this.query = query
          this.page = page

        })
        break;
    }
  }

  async seriePageManager(query: string, page: number) {
    if (this.lastPageSerie == null || Math.ceil(page / 5) != this.lastPageSerie) {
      let result = await this.serieService.search(query, Math.ceil(page / 5))
      this.seriePages = result.pages
      this.totalPage = result.lastPage
      this.lastPageSerie = Math.ceil(page / 5)
    }
    this.serieResult = this.seriePages[(page - 1) % 5]
  }


  // myList Pagination
  // animeAuxPage?: { anime: AnimeCatalogo; content: content<contentAnime>; }[][]

  animeAuxPage?: QueryDocumentSnapshot<DocumentData>[][] = []

  myListAnimePage: { anime: AnimeCatalogo; content: content; }[] = []
  serieAuxPage?: { serie: SerieCatalogo; content: content; }[][]
  myListSeriePage: { serie: SerieCatalogo; content: content; }[] = []
  bookAuxPage?: { book: BookCatalogo; content: content; }[][]
  myListBookPage: { book: BookCatalogo; content: content; }[] = []

  cleanContentMyList() {
    this.myListAnimePage = []
    this.myListSeriePage = []
    this.myListBookPage = []
  }

  async myListPage(page: number, type: search) {
    if (type == 'ANIME') {
      if (!this.animeAuxPage) {
        this.animeAuxPage = []
        // const firstWave = await this.listService.getAnimeContent()
        const animeQuery = await this.listService.getAnimeContent()

        for (let i = 0, j = animeQuery.docs.length; i < j; i += 12) {
          this.animeAuxPage.push(animeQuery.docs.slice(i, i + 12));
        }
        this.myListAnimePage = []
        this.animeAuxPage[page - 1].map(async (value, index) => {
          const content = value.data() as content
          const animeRaw = await this.animeService.getAnimeComplete(content.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.myListAnimePage.push({ anime, content })
        })
        // this.myListAnimePage = this.animeAuxPage[page - 1]
        this.totalPage = this.animeAuxPage.length
        return
      }
      if (page <= this.animeAuxPage.length) {
        this.myListAnimePage = []
        this.animeAuxPage[page - 1].map(async (value, index) => {
          const content = value.data() as content
          const animeRaw = await this.animeService.getAnimeComplete(content.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.myListAnimePage.push({ anime, content })
        })
        return
      } else {
        // const newWave = await this.listService.getAnimeContent(this.animeAuxPage[this.animeAuxPage.length - 1][11])

        const animeQuery = await this.listService.getAnimeContent()
        for (let i = 0, j = animeQuery.docs.length; i < j; i += 12) {
          this.animeAuxPage.push(animeQuery.docs.slice(i, i + 12));
        }
        // for(let i = 0; i <= this.animeAuxPage[page -1].length; i += 1){
        //   const content = this.animeAuxPage[page - 1][i].data() as content<contentAnime>
        //   const animeRaw = await this.animeService.getAnimeComplete(content.contentId as number,i)
        //   const anime = new AnimeCatalogo(undefined,undefined,animeRaw)
        //   this.myListAnimePage.push({anime, content})
        // }
        this.myListAnimePage = []
        this.animeAuxPage[page - 1].map(async (value, index) => {
          const content = value.data() as content
          const animeRaw = await this.animeService.getAnimeComplete(content.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.myListAnimePage.push({ anime, content })
        })
        // this.myListAnimePage = this.animeAuxPage[page - 1]
        this.totalPage = this.animeAuxPage.length
        return
      }
    } else if (type == 'SERIE') {
      if (!this.serieAuxPage) {
        this.serieAuxPage = []
        const firstWave = await this.listService.getAllSerieContent()
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.serieAuxPage.push(firstWave.slice(i, i + 12));
        }
        this.myListSeriePage = this.serieAuxPage[page - 1]
        this.totalPage = this.serieAuxPage.length

        return
      }
      if (page <= this.serieAuxPage.length) {
        this.myListSeriePage = this.serieAuxPage[page - 1]
        return
      } else {
        const newWave = await this.listService.getAllSerieContent(this.serieAuxPage[this.serieAuxPage.length - 1][11])
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.serieAuxPage.push(newWave.slice(i, i + 12));
        }
        this.myListSeriePage = this.serieAuxPage[page - 1]
        this.totalPage = this.serieAuxPage.length
        return
      }
    } else {
      if (!this.bookAuxPage) {
        this.bookAuxPage = []
        const firstWave = await this.listService.getAllBookContent()
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.bookAuxPage.push(firstWave.slice(i, i + 12));
        }
        this.myListBookPage = this.bookAuxPage[page - 1]
        this.totalPage = this.bookAuxPage.length
        return
      }
      if (page <= this.bookAuxPage.length) {
        this.myListBookPage = this.bookAuxPage[page - 1]
        return
      } else {
        const newWave = await this.listService.getAllBookContent(this.bookAuxPage[this.bookAuxPage.length - 1][11])
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.bookAuxPage.push(newWave.slice(i, i + 12));
        }
        this.myListBookPage = this.bookAuxPage[page - 1]
        this.totalPage = this.bookAuxPage.length
        return
      }
    }
  }

  // getAnimes() {
  //   this.listService.getAnimeContent().then((value) => {
  //     value.map((value) => {
  //       this.animeResult.push(value.anime)
  //     })
  //   })
  // }

  getSeries() {
    this.listService.getAllSerieContent().then((value) => {
      value.map((value) => {
        this.serieResult.push(value.serie)
      })
    })
  }

  getBooks() {
    this.listService.getAllBookContent().then((value) => {
      value.map((value) => {
        this.bookResult.push(value.book)
      })
    })
  }
  pageCatalogo(page: number = 1, searchType: string, pagination = false) {
    if (pagination) {
      this.clearContents()
    } else {
      this.initContent()
    }
    this.page = page
    switch (searchType) {
      case 'ANIME':
        this.animeService.getCatalogo(page).then((value) => {
          this.animeResult = value.anime
          this.totalPage = value.lastPage
          this.searchType = searchType
        })
        break;
      case 'BOOK':
        this.bookService.getCatalogo(page).then((value) => {
          this.bookResult = value.content
          this.totalPage = value.lastPage
          this.searchType = searchType
          this.page = page

        })
        break;
      case 'SERIE':
        this.seriePageManagerCatalogo(page).then(() => {
          this.searchType = searchType
          this.page = page

        })
        break;
    }
  }

  async seriePageManagerCatalogo(page: number) {
    if (this.lastPageSerie == null || Math.ceil(page / 5) != this.lastPageSerie) {
      let result = await this.serieService.getCatalogo(Math.ceil(page / 5))
      this.seriePages = result.pages
      this.totalPage = result.lastPage
      this.lastPageSerie = Math.ceil(page / 5)
    }
    this.serieResult = this.seriePages[(page - 1) % 5]
  }
  // friendListPagination

  friendAnimeAuxPage?: content[][]

  friendListAnimePage: { anime: AnimeCatalogo; content: content; }[] = []
  friendSerieAuxPage?: content[][]
  friendListSeriePage: { serie: SerieCatalogo; content: content; }[] = []
  friendBookAuxPage?: content[][]
  friendListBookPage: { book: BookCatalogo; content: content; }[] = []

  cleanContentFriendList() {
    this.friendListAnimePage = []
    this.friendListSeriePage = []
    this.friendListBookPage = []
  }

  async friendListPage(page: number, type: string, friendId: string) {
    this.cleanContentFriendList()
    if (type == 'anime') {
      if (!this.friendAnimeAuxPage) {
        this.friendAnimeAuxPage = []
        const animeContent = await this.listService.getFriendList(friendId, type as search)
        if (animeContent == false) {
          return false
        }
        for (let i = 0, j = animeContent.length; i < j; i += 12) {
          this.friendAnimeAuxPage.push(animeContent.slice(i, i + 12));
        }
        this.friendListAnimePage = []
        this.friendAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(value.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.friendListAnimePage.push({ anime, content: value })
        })
        this.totalPage = this.friendAnimeAuxPage.length
        return
      }
      if (page <= this.friendAnimeAuxPage.length) {
        this.friendListAnimePage = []
        this.friendAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(value.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.friendListAnimePage.push({ anime, content: value })
        })
        return
      } else {
        const animeQuery = await this.listService.getFriendList(
          friendId,
          type as search,
          this.friendAnimeAuxPage[this.friendAnimeAuxPage.length - 1][11]
        )
        if (animeQuery == false) {
          return false
        }
        for (let i = 0, j = animeQuery.length; i < j; i += 12) {
          this.friendAnimeAuxPage.push(animeQuery.slice(i, i + 12));
        }
        this.friendListAnimePage = []
        this.friendAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(value.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.friendListAnimePage.push({ anime, content: value })
        })
        this.totalPage = this.friendAnimeAuxPage.length
        return
      }
    } else if (type == 'serie') {
      if (!this.friendSerieAuxPage) {
        this.friendSerieAuxPage = []
        const firstWave = await this.listService.getFriendList(friendId, type as search)
        if (firstWave == false) {
          return false
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.friendSerieAuxPage.push(firstWave.slice(i, i + 12));
        }
        this.friendSerieAuxPage[page - 1].map(async (value, index) => {
          const serieComplete = await this.serieService.getSerieComplete(value.contentId as number)
          const serie = new SerieCatalogo(undefined, undefined, serieComplete)
          this.friendListSeriePage.push({ serie, content: value })
        })
        this.totalPage = this.friendSerieAuxPage.length
        return
      }
      if (page <= this.friendSerieAuxPage.length) {
        this.friendListSeriePage = []
        this.friendSerieAuxPage[page - 1].map(async (value, index) => {
          const serieRaw = await this.serieService.getSerieComplete(value.contentId as number)
          const serie = new SerieCatalogo(undefined, undefined, serieRaw)
          this.friendListSeriePage.push({ serie, content: value })
        })
        return
      } else {
        const newWave = await this.listService.getFriendList(
          friendId,
          type as search,
          this.friendSerieAuxPage[this.friendSerieAuxPage.length - 1][this.friendSerieAuxPage[this.friendSerieAuxPage.length - 1].length - 1]
        )
        if (newWave == false) {
          return false
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.friendSerieAuxPage.push(newWave.slice(i, i + 12));
        }
        this.friendSerieAuxPage[page - 1].map(async (value, index) => {
          const serieComplete = await this.serieService.getSerieComplete(value.contentId as number)
          const serie = new SerieCatalogo(undefined, undefined, serieComplete)
          this.friendListSeriePage.push({ serie, content: value })
        })
        this.totalPage = this.friendSerieAuxPage.length
        return
      }
    } else {
      if (!this.friendBookAuxPage) {
        this.friendBookAuxPage = []
        const firstWave = await this.listService.getFriendList(friendId, type as search)
        if (firstWave == false) {
          return false
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.friendBookAuxPage.push(firstWave.slice(i, i + 12));
        }
        this.friendBookAuxPage[page - 1].map(async (value, index) => {
          const bookComplete = await this.bookService.getBookComplete(value.contentId.toString())
          const book = new BookCatalogo(undefined, undefined, bookComplete)
          this.friendListBookPage.push({ book, content: value })
        })
        this.totalPage = this.friendBookAuxPage.length
        return
      }
      if (page <= this.friendBookAuxPage.length) {
        this.friendListBookPage = []
        this.friendBookAuxPage[page - 1].map(async (value, index) => {
          const bookRaw = await this.bookService.getBookComplete(value.contentId.toString())
          const book = new BookCatalogo(undefined, undefined, bookRaw)
          this.friendListBookPage.push({ book, content: value })
        })
        return
      } else {
        const newWave = await this.listService.getFriendList(friendId, type as search, this.friendBookAuxPage[this.friendBookAuxPage.length - 1][11])
        if (newWave == false) {
          return false
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.friendBookAuxPage.push(newWave.slice(i, i + 12));
        }
        this.friendBookAuxPage[page - 1].map(async (value, index) => {
          const bookComplete = await this.bookService.getBookComplete(value.contentId.toString())
          const book = new BookCatalogo(undefined, undefined, bookComplete)
          this.friendListBookPage.push({ book, content: value })
        })
        this.totalPage = this.friendBookAuxPage.length
        return
      }
    }
  }

  // my recommendation pagination

  myRecAnimeAuxPage?: content[][]

  myRecListAnimePage: { anime: AnimeCatalogo; content: content; }[] = []
  myRecSerieAuxPage?: content[][]
  myRecListSeriePage: { serie: SerieCatalogo; content: content; }[] = []
  myRecBookAuxPage?: content[][]
  myRecListBookPage: { book: BookCatalogo; content: content; }[] = []

  cleanContentMyRecList() {
    this.myRecListAnimePage = []
    this.myRecListSeriePage = []
    this.myRecListBookPage = []
  }

  async MyRecListPage(page: number, type: search) {
    this.cleanContentMyRecList()
    if (type == 'ANIME') {
      if (!this.myRecAnimeAuxPage) {
        this.myRecAnimeAuxPage = []
        const animeContent = await this.listService.getMyRecommendatation(type as search)
        if (animeContent == false) {
          return false
        }
        for (let i = 0, j = animeContent.length; i < j; i += 12) {
          this.myRecAnimeAuxPage.push(animeContent.slice(i, i + 12));
        }
        this.myRecAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(value.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.myRecListAnimePage.push({ anime, content: value })
        })
        this.totalPage = this.myRecAnimeAuxPage.length
        return
      }
      if (page <= this.myRecAnimeAuxPage.length) {
        this.myRecListAnimePage = []
        if(this.myRecAnimeAuxPage.length == 0){
          return false
        }
        this.myRecAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(value.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.myRecListAnimePage.push({ anime, content: value })
        })
        return
      } else {
        if(this.myRecAnimeAuxPage.length == 0){
          this.totalPage = 0
          return false
        }
        const animeQuery = await this.listService.getMyRecommendatation(
          type as search,
          this.myRecAnimeAuxPage[this.myRecAnimeAuxPage.length - 1][this.myRecAnimeAuxPage[this.myRecAnimeAuxPage.length - 1].length -1]
        )
        if (animeQuery == false) {
          return false
        }
        for (let i = 0, j = animeQuery.length; i < j; i += 12) {
          this.myRecAnimeAuxPage.push(animeQuery.slice(i, i + 12));
        }
        this.myRecListAnimePage = []
        this.myRecAnimeAuxPage[page - 1].map(async (value, index) => {
          const animeRaw = await this.animeService.getAnimeComplete(value.contentId as number, index)
          const anime = new AnimeCatalogo(undefined, undefined, animeRaw)
          this.myRecListAnimePage.push({ anime, content: value })
        })
        this.totalPage = this.myRecAnimeAuxPage.length
        return
      }
    } else if (type == 'SERIE') {
      if (!this.myRecSerieAuxPage) {
        this.myRecSerieAuxPage = []
        const firstWave = await this.listService.getMyRecommendatation(type as search)
        if (firstWave == false) {
          return false
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.myRecSerieAuxPage.push(firstWave.slice(i, i + 12));
        }
        this.myRecSerieAuxPage[page - 1].map(async (value, index) => {
          const serieComplete = await this.serieService.getSerieComplete(value.contentId as number)
          const serie = new SerieCatalogo(undefined, undefined, serieComplete)
          this.myRecListSeriePage.push({ serie, content: value })
        })
        this.totalPage = this.myRecSerieAuxPage.length
        return
      }
      if (page <= this.myRecSerieAuxPage.length) {
        this.myRecListSeriePage = []
        if(this.myRecSerieAuxPage.length == 0){
          return false
        }
        this.myRecSerieAuxPage[page - 1].map(async (value, index) => {
          const serieRaw = await this.serieService.getSerieComplete(value.contentId as number)
          const serie = new SerieCatalogo(undefined, undefined, serieRaw)
          this.myRecListSeriePage.push({ serie, content: value })
        })
        return
      } else {
        if(this.myRecSerieAuxPage.length == 0){
          this.totalPage = 0
          return false
        }
        const newWave = await this.listService.getMyRecommendatation(
          type as search,
          this.myRecSerieAuxPage[this.myRecSerieAuxPage.length - 1][this.myRecSerieAuxPage[this.myRecSerieAuxPage.length - 1].length - 1]
        )
        if (newWave == false) {
          return false
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.myRecSerieAuxPage.push(newWave.slice(i, i + 12));
        }
        this.myRecSerieAuxPage[page - 1].map(async (value, index) => {
          const serieComplete = await this.serieService.getSerieComplete(value.contentId as number)
          const serie = new SerieCatalogo(undefined, undefined, serieComplete)
          this.myRecListSeriePage.push({ serie, content: value })
        })
        this.totalPage = this.myRecSerieAuxPage.length
        return
      }
    } else {
      if (!this.myRecBookAuxPage) {
        this.myRecBookAuxPage = []
        const firstWave = await this.listService.getMyRecommendatation(type as search)
        if (firstWave == false) {
          return false
        }
        for (let i = 0, j = firstWave.length; i < j; i += 12) {
          this.myRecBookAuxPage.push(firstWave.slice(i, i + 12));
        }
        this.myRecBookAuxPage[page - 1].map(async (value, index) => {
          const bookComplete = await this.bookService.getBookComplete(value.contentId.toString())
          const book = new BookCatalogo(undefined, undefined, bookComplete)
          this.myRecListBookPage.push({ book, content: value })
        })
        this.totalPage = this.myRecBookAuxPage.length
        return
      }
      if (page <= this.myRecBookAuxPage.length) {
        this.myRecListBookPage = []
        if(this.myRecBookAuxPage.length == 0){
          return false
        }
        this.myRecBookAuxPage[page - 1].map(async (value, index) => {
          const bookRaw = await this.bookService.getBookComplete(value.contentId.toString())
          const book = new BookCatalogo(undefined, undefined, bookRaw)
          this.myRecListBookPage.push({ book, content: value })
        })
        return
      } else {
        if(this.myRecBookAuxPage.length == 0){
          return false
          this.totalPage = 0
        }
        const newWave = await this.listService.getMyRecommendatation(
          type as search,
          this.myRecBookAuxPage[this.myRecBookAuxPage.length - 1][11])
        if (newWave == false) {
          return false
        }
        for (let i = 0, j = newWave.length; i < j; i += 12) {
          this.myRecBookAuxPage.push(newWave.slice(i, i + 12));
        }
        this.myRecBookAuxPage[page - 1].map(async (value, index) => {
          const bookComplete = await this.bookService.getBookComplete(value.contentId.toString())
          const book = new BookCatalogo(undefined, undefined, bookComplete)
          this.myRecListBookPage.push({ book, content: value })
        })
        this.totalPage = this.myRecBookAuxPage.length
        return
      }
    }
  }
}

// catalogo Pagination


