import {
  DocumentReference,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { UserInterface } from './interfaces';

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
  ref?: DocumentReference;
}

export const UserConverter = {
  toFirestore: function (user: UserInterface) {
    return {
      ...user,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<any>,
    options: SnapshotOptions
  ) {
    return snapshot.data(options) as UserInterface;
  },
};

interface FriendFire {
  friendId: string;
  reference: DocumentReference;
}

export const friendConverter = {
  toFirestore: function (friend: FriendFire) {
    return {
      ...friend,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<any>,
    options: SnapshotOptions
  ) {
    return snapshot.data(options) as FriendFire;
  },
};

export const notificationConverter = {
  toFirestore: function (notification: Notification) {
    return {
      ...notification,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<any>,
    options: SnapshotOptions
  ) {
    return snapshot.data(options) as Notification;
  },
};
