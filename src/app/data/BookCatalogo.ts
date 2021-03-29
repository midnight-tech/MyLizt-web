import { BookService } from '../services/book/book.service';
import { BookCatalogoInterface, CompleteBook } from './interfaces'

export class BookCatalogo implements BookCatalogoInterface {
    id: string;
    volumeInfo: {
        authors: string[];
        description: string;
        imageLinks?: { thumbnail: string; } | undefined;
        language: string;
        subtitle: string;
        title: string;
    };
    complete?: CompleteBook;

    constructor(data: BookCatalogoInterface, public bookService: BookService) {
        this.id = data.id
        this.volumeInfo = data.volumeInfo
        this.complete = data.complete
    }

    getComplete() {
        this.bookService.getBookComplete(this.id).then((value) => {
            this.complete = value
        })
    }
}