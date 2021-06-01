import { Injectable } from '@angular/core';
import { friendConverter, UserConverter } from 'src/app/data/converters';
import { UserInterface } from 'src/app/data/interfaces';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotificationService } from '../notification/notification.service';
import firebase from "firebase/app"

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private auth: AuthenticationService,
    private notification: NotificationService
  ) { }

  async getFriend(lastFriend?: UserInterface) {
    let userFriendsQuery = firebase.firestore()
      .collection('User')
      .doc(this.auth.user?.uid)
      .collection('friends')
      .orderBy("friendId")

    if (lastFriend != undefined) {
      userFriendsQuery = userFriendsQuery.startAfter(lastFriend.applicationUserId)
    }

    const friendsQuery = await userFriendsQuery
      .withConverter(friendConverter)
      .get();
    const friends = friendsQuery.docs.map(async (value) => {
      const userFriends = value.data();
      const userData = await userFriends.reference
        .withConverter(UserConverter)
        .get();
      let user = userData.data()!
      user.ref = userData.ref
      return user
    });
    if (friends) {
      return await Promise.all(friends);
    }
    return [];
  }

  async sendFriendRequest(id: string) {
    const userQuery = await firebase.firestore()
      .collection('User')
      .where('applicationUserId', '==', id)
      .withConverter(UserConverter)
      .get();
    if (userQuery.empty) {
      return false;
    }
    const userForeing = userQuery.docs[0];
    await firebase.firestore().runTransaction(async (transaction) => {
      transaction = await this.notification.sendNotification(
        {
          message: {
            name: this.auth.user?.displayName!,
          },
          type: 'FRIENDREQUEST',
          data: {
            idEmmiter: this.auth.userFirestore?.applicationUserId,
            idReceiver: userForeing.data().applicationUserId,
          },
          time: new Date(Date.now())
        },
        transaction
      );
    });
    return true;
  }

  async acceptFriendRequest(id: string) {
    const myUser = await firebase.firestore()
      .collection('User')
      .doc(this.auth.user?.uid)
      .withConverter(UserConverter)
      .get();
    const userRequersterQuery = await firebase.firestore()
      .collection('User')
      .where('applicationUserId', '==', id)
      .withConverter(UserConverter)
      .get();
    if (userRequersterQuery.empty) {
      return false;
    }
    await firebase.firestore().runTransaction(async (transaction) => {
      const newFriendMyUser = myUser.ref.collection('friends').doc(id);
      const newFriendMyForeign = userRequersterQuery.docs[0]
        .ref
        .collection('friends')
        .doc(myUser.data()!.applicationUserId);
      transaction.set(newFriendMyUser, {
        friendId: id,
        reference: userRequersterQuery.docs[0].ref,
      });
      transaction.set(newFriendMyForeign, {
        friendId: myUser.data()?.applicationUserId,
        reference: myUser.ref,
      });
    });
    return true;
  }

  async removeFriend(id: string) {
    const friendQuery = await firebase.firestore()
      .collection('User')
      .doc(this.auth.user?.uid)
      .collection('friends')
      .where('friendId', '==', id)
      .withConverter(friendConverter)
      .get();
    if (friendQuery.empty) {
      return false;
    }
    const myUser = await firebase.firestore()
      .collection('User')
      .doc(this.auth.user?.uid)
      .withConverter(UserConverter)
      .get();
    const myUserData = myUser.data();
    const myfriend = friendQuery.docs[0].data();
    const myFriendrefer = await myfriend.reference
      .collection('friends')
      .where('friendId', '==', myUserData?.applicationUserId)
      .get();
    await firebase.firestore().runTransaction(async (transaction) => {
      transaction.delete(myFriendrefer.docs[0].ref);
      transaction.delete(friendQuery.docs[0].ref);
    });
    return true;
  }

  async getUserNameArray(userList: firebase.firestore.DocumentReference<UserInterface>[]) {
    return await Promise.all(userList.map(async (value) => {
      const user = await value.get()
      return user.data()!.username
    }))
  }

  async getUserName(id: string) {
    const userQuery = await firebase.firestore().collection('User').where("applicationUserId", '==', id).withConverter(UserConverter).get()
    if (userQuery.empty) {
      throw "userQuery empty"
    }
    const userData = userQuery.docs[0].data()
    return userData.username
  }

  async getUserFromIdApp(idApp: string) {
    const friendQuery = await firebase.firestore()
      .collection('User')
      .where('applicationUserId', '==', idApp)
      .withConverter(UserConverter)
      .get();
    if (friendQuery.empty) {
      return null
    }
    return friendQuery.docs[0].data()!
  }
}
