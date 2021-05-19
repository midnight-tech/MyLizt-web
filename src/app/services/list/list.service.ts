import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { BookCatalogo } from 'src/app/data/BookCatalogo';
import { contentConverter, UserConverter } from 'src/app/data/converters';
import {
  content,
  listInterface,
  search,
  UserInterface,
} from 'src/app/data/interfaces';
import { List } from 'src/app/data/List';
import { SerieCatalogo } from 'src/app/data/SerieCatalogo';
import { AnimeService } from '../anime/anime.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { BookService } from '../book/book.service';
import { SerieService } from '../serie/serie.service';
import firebase from 'firebase';
import { NotificationService } from '../notification/notification.service';
import { AnimeCatalogo } from 'src/app/data/CatalogoAnime';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private myList?: List;

  constructor(
    private auth: AuthenticationService,
    private serieService: SerieService,
    private BookService: BookService,
    private firestore: AngularFirestore,
    private notificationService: NotificationService,
    private animeService: AnimeService
  ) { }

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

  async contentInMyList(id: string | number, type: search, friendList?: DocumentReference) {

    let content

    if (friendList == undefined) {
      content = this.auth.userFirestore!.myList
    } else {
      content = friendList
    }
    let contentQuery = await content.collection(type.toLowerCase())
      .doc(id.toString())
      .withConverter(contentConverter)
      .get();
    return contentQuery;
  }

  async addContent(id: string | number, type: search) {
    if (this.auth.userFirestore == undefined) {
      return false;
    }
    const listDocRef = this.auth.userFirestore?.myList
      .collection(type.toLowerCase())
      .doc(id.toString())
      .withConverter(contentConverter);
    await this.firestore.firestore.runTransaction(async (transaction) => {
      transaction = this.changeQuantContCount(1, type, transaction);
      transaction.set(listDocRef, {
        contentId: id as string,
        contentType: type,
        watched: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(0),
        recommended: null,
        season: type == 'SERIE' ? 0 : null,
        mark: 0,
      });
    });
    return true;
  }

  async getAnimeContent(lastDoc?: DocumentData) {
    let animeQuery = this.auth
      .userFirestore!!.myList.collection('anime')
      .where('recommended', '==', null)
      .orderBy('watched', 'asc')
      .orderBy('updatedAt', 'desc')
      .orderBy('contentId', 'asc')
    if (lastDoc != undefined) {
      animeQuery = animeQuery.startAfter(lastDoc.watched, lastDoc.updatedAt, lastDoc.contentId)
    }
    const animeResult = await animeQuery
      .limit(12)
      .withConverter(contentConverter)
      .get();
    let finalResult = animeResult.docs.map(async (animeData) => {
      let animeFireResult = animeData.data();
      let animeResult = await this.animeService.getAnimeComplete(
        animeFireResult.contentId as number
      );
      let animeCatalogo = new AnimeCatalogo(undefined, undefined, animeResult);
      return { anime: animeCatalogo, content: animeFireResult };
    });
    return await Promise.all(finalResult);
  }

  async getAllSerieContent(lastDoc?: content) {
    let serieQueryRaw = this.auth
      .userFirestore!.myList.collection('serie')
      .where('recommended', '==', null)
      .orderBy('watched', 'asc')
      .orderBy('updatedAt', 'desc')
      .orderBy('contentId', 'asc')
    if (lastDoc != undefined) {
      serieQueryRaw = serieQueryRaw.startAfter(lastDoc.watched, lastDoc.updatedAt, lastDoc.contentId)
    }
    let serieQuery = await serieQueryRaw
      .limit(12)
      .withConverter(contentConverter)
      .get()
    let finalResult = serieQuery.docs.map(async (serieData) => {
      let serieFireResult = serieData.data();
      let serieResult = await this.serieService.getSerieComplete(
        serieFireResult.contentId as number
      );
      let serieCatalogo = new SerieCatalogo(undefined, undefined, serieResult);
      return { serie: serieCatalogo, content: serieFireResult };
    });
    return await Promise.all(finalResult)
  }

  async getAllBookContent(lastDoc?: DocumentData) {
    let bookQueryRaw = this.auth
      .userFirestore!!.myList.collection('book')
      .where('recommended', '==', null)
      .orderBy('watched', 'asc')
      .orderBy('updatedAt', 'desc')
      .orderBy('contentId', 'asc')
    if (lastDoc) {
      bookQueryRaw = bookQueryRaw.startAfter(lastDoc)
    }
    let bookQuery = await bookQueryRaw
      .limit(12)
      .withConverter(contentConverter)
      .get();
    let finalResult = bookQuery.docs.map(async (bookData) => {
      let bookFireResult = bookData.data();
      let bookResult = await this.BookService.getBookComplete(
        bookFireResult.contentId as string
      );

      let bookCatalogo = new BookCatalogo(undefined, undefined, bookResult);
      return { book: bookCatalogo, content: bookFireResult };
    });
    return await Promise.all(finalResult);
  }

  async removeFromList(content: content) {
    if (content.ref == undefined) {
      throw 'ref undefined';
    }
    if (this.auth.userFirestore == undefined) {
      throw 'user infos undefined';
    }
    const contentRef = content.ref;
    await this.firestore.firestore.runTransaction(async (transaction) => {
      transaction = this.changeQuantContCount(
        -1,
        content.contentType,
        transaction
      );
      transaction.delete(contentRef);
    });
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
      .orderBy('watched')
      .orderBy('updatedAt', 'desc')
      .limit(5)
      .withConverter(contentConverter)
      .get();
    let bookQuery = await this.auth.userFirestore?.myList
      .collection('book')
      .where('recommended', '==', null)
      .orderBy('watched')
      .orderBy('updatedAt', 'desc')
      .limit(5)
      .withConverter(contentConverter)
      .get();
    let serieQuery = await this.auth.userFirestore?.myList
      .collection('serie')
      .where('recommended', '==', null)
      .orderBy('watched')
      .orderBy('updatedAt', 'desc')
      .limit(5)
      .withConverter(contentConverter)
      .get();
    let anime = animeQuery?.docs.map((value) => {
      return value.data();
    });
    let book = bookQuery?.docs.map((value) => {
      return value.data();
    });
    let serie = serieQuery?.docs.map((value) => {
      return value.data();
    });
    return { anime, book, serie };
  }

  async recomendContent(
    contentId: string,
    contentName: string,
    friendId: string,
    type: search
  ) {
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
      .withConverter(contentConverter)
      .get();

    if (content.exists && content.data()!.recommended != null) {
      for (let i = 0; i < content.data()!.recommended!.length; i += 1) {
        if (
          this.userEqual(
            content.data()!.recommended![i],
            myUser
          )
        ) {
          return false;
        }
      }
    }
    const recommendationRef = friend.docs[0]
      .data()
      .myList.collection(type.toLowerCase())
      .withConverter(contentConverter)
      .doc(contentId);

    await this.firestore.firestore.runTransaction(async (transaction) => {
      transaction = this.changeRecCount(
        1,
        type,
        friend.docs[0].data(),
        transaction
      );
      transaction = await this.notificationService.sendNotification(
        {
          message: {
            name: this.auth.userFirestore!.username,
            contentName: contentName,
          },
          type: 'RECOMENDATION',
          data: {
            idEmmiter: this.auth.userFirestore!.applicationUserId,
            idReceiver: friend.docs[0].data().applicationUserId,
            contentType: type.toLowerCase() as 'anime' | 'serie' | 'book',
            idContent: contentId,
          },
        },
        transaction
      );
      transaction.set(recommendationRef, {
        contentId: contentId,
        contentType: type,
        watched: false,
        createdAt: new Date(Date.now()),
        // @ts-ignore
        recommended: firebase.firestore.FieldValue.arrayUnion(myUser),
      }, { merge: true });
    });
    return true;
  }

  userEqual(
    user1: DocumentReference<UserInterface>,
    user2: DocumentReference<UserInterface>
  ) {
    return user1.path == user2.path;
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
        .where('recommended', '==', null)
        .orderBy('watched')
        .startAfter(lastContent)
        .limit(60)
        .withConverter(contentConverter)
        .get();
    } else {
      content = await friendQuery.docs[0]
        .data()
        .myList.collection(type.toLowerCase())
        .where('recommended', '==', null)
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

  async editContent(
    content: content,
    count: boolean = false,
    contentRec: boolean = false
  ) {
    if (content.ref == undefined) {
      throw 'ContentRef Undefined';
    }
    content.updatedAt = new Date(Date.now());
    await this.firestore.firestore.runTransaction(async (transaction) => {
      if (count) {
        transaction = this.changeQuantContCount(
          1,
          content.contentType,
          transaction
        );
      }
      if (contentRec) {
        if (this.auth.userFirestore == null) {
          throw 'User Null';
        }
        transaction = this.changeRecCount(
          -1,
          content.contentType,
          this.auth.userFirestore!,
          transaction
        );
      }
      transaction.update(content.ref!, content);
    });
    const newContentRaw = await content
      .ref!.withConverter(contentConverter)
      .get();
    const newContent = newContentRaw.data()!;
    newContent.ref = newContentRaw.ref;
    return newContent;
  }

  changeQuantContCount(
    count: number,
    contentType: search,
    transaction: firebase.firestore.Transaction
  ) {
    let update;
    switch (contentType) {
      case 'ANIME':
        update = {
          animeCount: firebase.firestore.FieldValue.increment(count),
        };
        break;
      case 'SERIE':
        update = {
          serieCount: firebase.firestore.FieldValue.increment(count),
        };
        break;
      case 'BOOK':
        update = {
          bookCount: firebase.firestore.FieldValue.increment(count),
        };
        break;
      default:
        throw 'Type undefined';
    }
    transaction.update(this.auth.userFirestore!.myList, update);
    return transaction;
  }

  changeRecCount(
    count: number,
    contentType: search,
    friendDoc: UserInterface,
    transaction: firebase.firestore.Transaction
  ) {
    let update;
    switch (contentType) {
      case 'ANIME':
        update = {
          animeCountRec: firebase.firestore.FieldValue.increment(count),
        };
        break;
      case 'SERIE':
        update = {
          serieCountRec: firebase.firestore.FieldValue.increment(count),
        };
        break;
      case 'BOOK':
        update = {
          bookCountRec: firebase.firestore.FieldValue.increment(count),
        };
        break;
      default:
        throw 'Type undefined';
    }
    transaction.update(friendDoc.myList, update);
    return transaction;
  }

  async getTotalContent(user: UserInterface) {
    const userList = await user.myList.get()
    return {
      anime: userList.data()!.animeCount,
      serie: userList.data()!.serieCount,
      book: userList.data()!.bookCount

    }
  }
}
