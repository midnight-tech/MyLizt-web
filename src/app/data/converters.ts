import firebase from 'firebase/app'
import { content, UserInterface } from "./interfaces";

export interface Notification {
  message: {
    name: string;
    contentName?: string;
  };
  type: 'RECOMENDATION' | 'FRIENDREQUEST';
  data: {
    idEmmiter?: string;
    idReceiver?: string;
    idContent?: string;
    contentType?: 'anime' | 'serie' | 'book';
  };
  ref?: firebase.firestore.DocumentReference;
  time: Date
}

export const UserConverter = {
  toFirestore: function (user: UserInterface) {
    return {
      ...user,
    };
  },
  fromFirestore: function (
    snapshot: firebase.firestore.QueryDocumentSnapshot<any>,
    options: firebase.firestore.SnapshotOptions
  ) {
    return snapshot.data(options) as UserInterface;
  },
};

interface FriendFire {
  friendId: string;
  reference: firebase.firestore.DocumentReference;
}

export const friendConverter = {
  toFirestore: function (friend: FriendFire) {
    return {
      ...friend,
    };
  },
  fromFirestore: function (
    snapshot: firebase.firestore.QueryDocumentSnapshot<any>,
    options: firebase.firestore.SnapshotOptions
  ) {
    return snapshot.data(options) as FriendFire;
  },
};

export const notificationConverter = {
  toFirestore: function (notification: Notification) {
    return {
      ...notification
    }
  },
  fromFirestore: function (snapshot: firebase.firestore.QueryDocumentSnapshot<any>, options: firebase.firestore.SnapshotOptions) {
    return snapshot.data(options) as Notification
  }
}

export const contentConverter = {
  toFirestore: function (content: content) {
    return {
      ...content
    }
  },
  fromFirestore: function (snapshot: firebase.firestore.QueryDocumentSnapshot<any>, options: firebase.firestore.SnapshotOptions) {
    return snapshot.data(options) as content
  }
}
