import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { CompleteAnime, CompleteBook, CompleteSerie, content, contentAnime, contentBook, contentSerie, search } from 'src/app/data/interfaces';
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

  changePage(page: number, pageCalled: 'search' | 'myContent' | 'friend' | 'catalogo' = 'search', type?: string) {
    if (pageCalled == 'search') {
      if (page != this.page && page > 0 && page <= this.totalPage) {
        console.log(this)
        this.pageSearch(this.query, page, this.searchType!!, true)
      }
      return
    } else if (pageCalled == 'myContent') {
      if (!type) {
        throw "Query sem type"
      }
      if (page > 0 && (page <= this.totalPage || this.totalPage == 0)) {
        this.myListPage(page, type).then(() => {
          this.page = page
        })
      }
    } else if (pageCalled == 'catalogo') {
      if (!type) {
        throw "Query sem type"
      }
      if (page != this.page && page > 0 && (page <= this.totalPage || this.totalPage == 0)) {
        this.pageCatalogo(page, type, true)
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

  myListAnimePage: { anime: AnimeCatalogo; content: content<contentAnime>; }[] = []
  serieAuxPage?: { serie: SerieCatalogo; content: content<contentSerie>; }[][]
  myListSeriePage: { serie: SerieCatalogo; content: content<contentSerie>; }[] = []
  bookAuxPage?: { book: BookCatalogo; content: content<contentBook>; }[][]
  myListBookPage: { book: BookCatalogo; content: content<contentBook>; }[] = []

  cleanContentMyList() {
    this.myListAnimePage = []
    this.myListSeriePage = []
    this.myListBookPage = []
  }

  async myListPage(page: number, type: string) {
    if (type == 'anime') {
      if (!this.animeAuxPage) {
        this.animeAuxPage = []
        // const firstWave = await this.listService.getAnimeContent()
        const animeQuery = await this.listService.getAnimeContent()

        for (let i = 0, j = animeQuery.docs.length; i < j; i += 12) {
          this.animeAuxPage.push(animeQuery.docs.slice(i, i + 12));
        }
        this.myListAnimePage = []
        this.animeAuxPage[page -1].map(async (value,index)=>{
          const content = value.data() as content<contentAnime>
          const animeRaw = await this.animeService.getAnimeComplete(content.contentId as number,index)
          const anime = new AnimeCatalogo(undefined,undefined,animeRaw)
          this.myListAnimePage.push({anime, content})
        })
        // this.myListAnimePage = this.animeAuxPage[page - 1]
        this.totalPage = this.animeAuxPage.length
        return
      }
      if (page <= this.animeAuxPage.length) {
        this.myListAnimePage = []
        this.animeAuxPage[page -1].map(async (value,index)=>{
          const content = value.data() as content<contentAnime>
          const animeRaw = await this.animeService.getAnimeComplete(content.contentId as number,index)
          const anime = new AnimeCatalogo(undefined,undefined,animeRaw)
          this.myListAnimePage.push({anime, content})
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
        this.animeAuxPage[page -1].map(async (value,index)=>{
          const content = value.data() as content<contentAnime>
          const animeRaw = await this.animeService.getAnimeComplete(content.contentId as number,index)
          const anime = new AnimeCatalogo(undefined,undefined,animeRaw)
          this.myListAnimePage.push({anime, content})
        })
        // this.myListAnimePage = this.animeAuxPage[page - 1]
        this.totalPage = this.animeAuxPage.length
        return
      }
    } else if (type == 'serie') {
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
}

// catalogo Pagination