import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';
import { contentConverter, UserConverter } from 'src/app/data/converters';
import { content, listInterface, search } from 'src/app/data/interfaces';
import { List } from 'src/app/data/List';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private myList?: List;

  constructor(
    private auth: AuthenticationService,
    private animeService: AnimeService,
    private serieService: SerieService,
    private BookService: BookService,
    private firestore: AngularFirestore
  ) {}

  async getMyList() {
    const myUser = this.auth.userFirestore!!;
    if (this.myList) {
      return this.myList;
    }
    const data = await myUser.myList.get({});
    this.myList = new List(
      { ...(data.data() as listInterface), uid: data.id },
      this
    );
    return this.myList;
  }

  async contentInMyList(id: string | number, type: search) {
    let contentQuery = await this.auth
      .userFirestore!.myList.collection(type.toLowerCase())
      .doc(id.toString())
      .withConverter(contentConverter)
      .get();
    return contentQuery;
  }

  async addContent(id: string | number, type: search) {
    this.auth.userFirestore?.myList
      .collection(type.toLowerCase())
      .doc(id.toString())
      .withConverter(contentConverter)
      .set({
        contentId: id as string,
        contentType: type,
        watched: false,
        createdAt: new Date(Date.now()),
        recommended: null,
        season: type == 'SERIE' ? 0 : undefined,
        mark: 0,
      });
  }

  async getAnimeContent(lastDoc?: DocumentData) {
    let animeQuery: QuerySnapshot<DocumentData>;
    if (lastDoc) {
      animeQuery = await this.auth
        .userFirestore!!.myList.collection('anime')
        .orderBy('watched')
        .where('recommended', '==', null)
        .startAfter(lastDoc)
        .limit(60)
        .get();
    } else {
      animeQuery = await this.auth
        .userFirestore!!.myList.collection('anime')
        .orderBy('watched')
        .where('recommended', '==', null)
        .limit(60)
        .get();
    }
    return animeQuery;
  }
  async getAllSerieContent(lastDoc?: DocumentData) {
    let serieQuery: QuerySnapshot<DocumentData>;
    if (lastDoc) {
      serieQuery = await this.auth
        .userFirestore!!.myList.collection('serie')
        .orderBy('watched')
        .where('recommended', '==', null)
        .startAfter(lastDoc)
        .limit(60)
        .get();
    } else {
      serieQuery = await this.auth
        .userFirestore!!.myList.collection('serie')
        .orderBy('watched')
        .where('recommended', '==', null)
        .limit(60)
        .get();
    }
    let finalResult = serieQuery.docs.map(async (serieData) => {
      let serieFireResult = serieData.data() as content;
      let serieResult = await this.serieService.getSerieComplete(
        serieFireResult.contentId as number
      );

      let serieCatalogo = new SerieCatalogo(undefined, undefined, serieResult);
      return { serie: serieCatalogo, content: serieFireResult };
    });
    return await Promise.all(finalResult);
  }
  async getAllBookContent(lastDoc?: DocumentData) {
    let bookQuery;
    if (lastDoc) {
      bookQuery = await this.auth
        .userFirestore!!.myList.collection('book')
        .orderBy('watched')
        .where('recommended', '==', null)
        .startAfter(lastDoc)
        .limit(60)
        .get();
    } else {
      bookQuery = await this.auth
        .userFirestore!!.myList.collection('book')
        .orderBy('watched')
        .where('recommended', '==', null)
        .limit(60)
        .get();
    }
    let finalResult = bookQuery.docs.map(async (bookData) => {
      let bookFireResult = bookData.data() as content;
      let bookResult = await this.BookService.getBookComplete(
        bookFireResult.contentId as string
      );

      let bookCatalogo = new BookCatalogo(undefined, undefined, bookResult);
      return { book: bookCatalogo, content: bookFireResult };
    });
    return await Promise.all(finalResult);
  }

  async removeFromList(id: string, type: 'anime' | 'serie' | 'book') {
    await this.auth.userFirestore?.myList.collection(type).doc(id).delete();
  }

  async alterMyRating(documentReference: DocumentReference, value?: number) {
    await documentReference.withConverter(contentConverter).update({
      myrating: value != undefined ? value : null,
    });
    return await documentReference.withConverter(contentConverter).get();
  }

  async getHomeContent() {
    let animeQuery = await this.auth.userFirestore?.myList
      .collection('anime')
      .where('recommended', '==', null)
      .limit(5)
      .get();
    let bookQuery = await this.auth.userFirestore?.myList
      .collection('book')
      .where('recommended', '==', null)
      .limit(5)
      .get();
    let serieQuery = await this.auth.userFirestore?.myList
      .collection('serie')
      .where('recommended', '==', null)
      .limit(5)
      .get();
    let anime = animeQuery?.docs.map((value) => {
      return value.data() as content;
    });
    let book = bookQuery?.docs.map((value) => {
      return value.data() as content;
    });
    let serie = serieQuery?.docs.map((value) => {
      return value.data() as content;
    });
    return { anime, book, serie };
  }

  async recomendContent(contentId: string, friendId: string, type: search) {
    const myUser = this.firestore.firestore
      .collection('User')
      .doc(this.auth.user?.uid)
      .withConverter(UserConverter);
    const friend = await this.firestore.firestore
      .collection('User')
      .where('applicationUserId', '==', friendId)
      .withConverter(UserConverter)
      .get();
    if (friend.empty) {
      return false;
    }
    const content = await friend.docs[0]
      .data()
      .myList.collection(type.toLowerCase())
      .doc(contentId)
      .get();
    if (content.exists) {
      return false;
    }
    await friend.docs[0]
      .data()
      .myList.collection(type.toLowerCase())
      .withConverter(contentConverter)
      .doc(contentId)
      .set({
        contentId: contentId,
        contentType: type,
        watched: false,
        createdAt: new Date(Date.now()),
        recommended: myUser,
      });
    return true;
  }

  async getFriendList(
    friendId: string,
    type: search,
    lastContent?: DocumentData
  ) {
    const friendQuery = await this.firestore.firestore
      .collection('User')
      .where('applicationUserId', '==', friendId)
      .withConverter(UserConverter)
      .get();
    if (friendQuery.empty) {
      return false;
    }
    let content: QuerySnapshot<content>;
    if (lastContent) {
      content = await friendQuery.docs[0]
        .data()
        .myList.collection(type.toLowerCase())
        .orderBy('watched')
        .startAfter(lastContent)
        .limit(60)
        .withConverter(contentConverter)
        .get();
    } else {
      content = await friendQuery.docs[0]
        .data()
        .myList.collection(type.toLowerCase())
        .orderBy('watched')
        .limit(60)
        .withConverter(contentConverter)
        .get();
    }
    if (content.empty) {
      return false;
    }
    return content.docs.map((value) => {
      let content = value.data();
      content.ref = value.ref;
      return content;
    });
  }

  async getMyRecommendatation(type: search, lastContent?: DocumentData) {
    let content: QuerySnapshot<content>;
    if (!this.auth.userFirestore) {
      return false;
    }
    if (lastContent) {
      content = await this.auth.userFirestore.myList
        .collection(type.toLowerCase())
        .where('recommended', '!=', null)
        .startAfter(lastContent)
        .limit(60)
        .withConverter(contentConverter)
        .get();
    } else {
      content = await this.auth.userFirestore.myList
        .collection(type.toLowerCase())
        .where('recommended', '!=', null)
        .limit(60)
        .withConverter(contentConverter)
        .get();
    }

    if (content.empty) {
      return false;
    }

    return content.docs
      .map((value) => {
        const cont = value.data();
        cont.ref = value.ref;
        return cont;
      })
      .sort((a, b) => {
        if (a == b) {
          return 0;
        }
        if (a.watched) {
          return 1;
        }
        return -1;
      });
  }

  async setContentStopped(content: content) {
    content.updatedAt = new Date(Date.now());
    await content.ref!.update(content);
    const newContentRaw = await content
      .ref!.withConverter(contentConverter)
      .get();
    const newContent = newContentRaw.data()!;
    newContent.ref = newContentRaw.ref;
    return newContent;
  }
}
