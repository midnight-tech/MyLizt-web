import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notification, notificationConverter } from 'src/app/data/converters';
import { AuthenticationService } from '../authentication/authentication.service';
import firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications: Notification[] = [];

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthenticationService,
    private ngZone: NgZone
  ) {
    this.createListener();
  }

  async sendNotification(notification: Notification, transaction: firebase.firestore.Transaction) {
    if (notification.data.idReceiver == this.auth.userFirestore!.applicationUserId) throw ""
    const receiverQuery = await this.firestore.firestore
      .collection('User')
      .where('applicationUserId', '==', notification.data.idReceiver)
      .get();
    const receiver = receiverQuery.docs[0];
    const docRefer = receiver.ref.collection('notification').doc()
    return transaction.set(docRefer, notification);
  }

  async deleteNotification(notification: Notification) {
    if (notification.ref) {
      await notification.ref.delete();
      return true;
    }
    return false;
  }

  createListener() {
    this.auth.unsub = this.firestore.firestore
      .collection('User')
      .doc(this.auth.user?.uid)
      .collection('notification')
      .withConverter(notificationConverter)
      .onSnapshot((Snapshot) => {
        this.ngZone.run(() => {
          const docs = Snapshot.docChanges();
          docs.map((value) => {
            switch (value.type) {
              case 'added':
                const notification = value.doc.data();
                notification.ref = value.doc.ref;
                this.notifications.push(notification);
                break;
              case 'removed':
                this.notifications = this.notifications.filter(
                  (notification) => {
                    return value.doc.ref.id != notification.ref?.id;
                  }
                );
                break;
            }
          });
        });
      });
  }
}
