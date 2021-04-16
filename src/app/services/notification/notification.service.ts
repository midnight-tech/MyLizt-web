import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notification, notificationConverter } from 'src/app/data/converters';
import { AuthenticationService } from '../authentication/authentication.service';

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

  async sendNotification(notification: Notification) {
    const receiverQuery = await this.firestore.firestore
      .collection('User')
      .where('applicationUserId', '==', notification.data.idReceiver)
      .get();
    const receiver = receiverQuery.docs[0];
    await receiver.ref.collection('notification').add(notification);
  }

  async deleteNotification(notification: Notification) {
    console.log(notification);
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
                    console.log(notification.ref?.id, value.doc.id);
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
