import { environment } from 'src/environments/environment';
import { BookService } from '../services/book/book.service';
import { BookCatalogoInterface, CompleteBook } from './interfaces'

export class BookCatalogo implements BookCatalogoInterface {
    id: string;
    volumeInfo: {
        authors: string[];
        description: string;
        imageLinks?: {
            smallThumbnail?: string,
            thumbnail?: string,
            small?: string,
            medium?: string,
            large?: string,
        }
        language: string;
        subtitle: string;
        title: string;
        image: string;
    };
    complete?: CompleteBook;
    private functionCalled = false

    constructor(data?: BookCatalogoInterface, public bookService?: BookService, completeBook? : CompleteBook) {
        if(data){
            if(!bookService){
                throw "Sem bookService"
            }
            this.id = data.id
            this.volumeInfo = data.volumeInfo
            this.complete = data.complete
        } else if (completeBook){
            this.id = completeBook.id,
            // @ts-ignore
            this.volumeInfo = completeBook.volumeInfo
            this.complete = completeBook
        } else {
            throw "Todos elementos não setados"
        }
    }

    getComplete() {
        if (this.functionCalled == false) {
            this.functionCalled = true
            if (!this.complete) {
                this.bookService!!.getBookComplete(this.id).then((value) => {
                    this.complete = value
                }).catch((error) => {
                    if (environment.production == false) {
                        console.log(error)
                    }
                }).finally(() => {
                    this.functionCalled = false
                })
            }
        }
    }
}