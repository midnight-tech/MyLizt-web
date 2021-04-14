import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { friendConverter, UserConverter } from 'src/app/data/converters';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthenticationService,
    private notification : NotificationService
  ) { }

  async getFriend() {
    const userFriendsQuery = await this.firestore.firestore.collection('User').doc(this.auth.user?.uid).collection('friends').withConverter(friendConverter).get()
    const friends = userFriendsQuery.docs.map(async (value) => {
      const userFriends = value.data()
      const user = await userFriends.reference.withConverter(UserConverter).get()
      return user.data()!
    })
    if (friends) {
      return await Promise.all(friends)
    }
    return []
  }

  async sendFriendRequest(id: string) {
    const userQuery = await this.firestore.firestore.collection('User').where('applicationUserId', '==', id).withConverter(UserConverter).get()
    if (userQuery.empty) {
      return false
    }
    const userForeing = userQuery.docs[0]
    this.notification.sendNotification({
      message : `${this.auth.user?.displayName} want to be your friend`,
      type : 'FRIENDREQUEST',
      data : {
        idEmmiter: this.auth.userFirestore?.applicationUserId,
        idReceiver : userForeing.data().applicationUserId
      }
    })
    return true

  }

  async acceptFriendRequest(id:string){
    const myUser = await this.firestore.firestore.collection('User').doc(this.auth.user?.uid).withConverter(UserConverter).get()
    const userRequersterQuery = await this.firestore.firestore.collection('User').where('applicationUserId', '==' , id).withConverter(UserConverter).get()
    if(userRequersterQuery.empty){
      return false
    }
    await myUser.ref.collection('friends').add({
      friendId : id,
      reference : userRequersterQuery.docs[0].ref
    })
    await userRequersterQuery.docs[0].ref.collection('friends').add({
      friendId : myUser.data()?.applicationUserId,
      reference : myUser.ref
    })
    return true
  }

  async removeFriend(id: string) {
    const friendQuery = await this.firestore.firestore.collection('User').doc(this.auth.user?.uid).collection('friends').where('friendId', '==', id).withConverter(friendConverter).get()
    if (friendQuery.empty) {
      return false
    }
    const myUser = await this.firestore.firestore.collection('User').doc(this.auth.user?.uid).withConverter(UserConverter).get()
    const myUserData = myUser.data()
    const myfriend = friendQuery.docs[0].data()
    const myFriendrefer = await myfriend.reference.collection('friends').where('friendId', '==', myUserData?.applicationUserId).get()
    await myFriendrefer.docs[0].ref.delete() // deleta usuario na tabela de amigos do amigo
    await friendQuery.docs[0].ref.delete() // deleta amigo da tabela do usuario
    return true
  }
}
