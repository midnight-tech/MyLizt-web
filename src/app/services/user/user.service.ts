import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserConverter } from 'src/app/data/converters';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(
  private firestore : AngularFirestore,
  private auth : AuthenticationService
) { }

  async getFriend(){
    const user = await this.firestore.firestore.collection('User').doc(this.auth.user?.uid).withConverter(UserConverter).get()
    const userData = user.data()
    const friends = userData?.friends.map(async (value)=>{
      const user = await value.withConverter(UserConverter).get()
      return user.data()!
    })
    if(friends){
      return await Promise.all(friends)
    }
    return []
  }

  async addFriend(){

  }

  async removeFriend(){

  }
}
