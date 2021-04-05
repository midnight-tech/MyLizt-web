/// <reference path="../../../../node_modules/@types/gapi/index.d.ts">
import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { content, listInterface, UserInterface } from 'src/app/data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLogged: boolean = false
  user: firebase.User | null = null
  userFirestore : UserInterface | null = null

  constructor(public fireAuth: AngularFireAuth,public fireStore : AngularFirestore, router: Router, ngZone: NgZone) {
    fireAuth.onAuthStateChanged((user) => {
      ngZone.run(() => {
        if (user) {
          if (user.emailVerified) {
            this.user = user
            this.isLogged = true
            fireStore.firestore.collection('User').doc(user.uid).get().then((value)=>{
              this.userFirestore = value.data() as UserInterface
              router.navigate(['home'])
            })
            return
          }
          router.navigateByUrl('/verification')
          this.logout()
        }
        this.isLogged = false
        this.user = user
      })
    })
  }

  async signIn(email: string, password: string) {
      let user = await this.fireAuth.signInWithEmailAndPassword(email, password)
      if(user.additionalUserInfo?.isNewUser){
        await this.initUser(user.user?.uid!!,user.user?.displayName!!)
      }
  }

  async signInWithGoogle() {
    let user = await this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    if(user.additionalUserInfo?.isNewUser){
      await this.initUser(user.user?.uid!!,user.user?.displayName!!)
    }
  }

  async signInWithFacebook() {
    const user = await this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    if(user.additionalUserInfo?.isNewUser){
      await this.initUser(user.user?.uid!!,user.user?.displayName!!)
    }
  }

  async signInWithTwitter() {
    const user = await this.fireAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
    if(user.additionalUserInfo?.isNewUser){
      await this.initUser(user.user?.uid!!,user.user?.displayName!!)
    }
  }

  async signInWithApple() {
    throw "Not implemented"
  }

  async signUpWithEmail(userName: string, email: string, password: string) {
    let user = await this.fireAuth.createUserWithEmailAndPassword(email, password)
    user.user?.sendEmailVerification()
    user.user?.updateProfile({ displayName: userName })
    if(user.additionalUserInfo?.isNewUser){
      await this.initUser(user.user?.uid!!,user.user?.displayName!!)
    }
  }

  async logout() {
    await this.fireAuth.signOut()
  }

  async initUser(uid:string,username : string){
    console.log(uid)
    let list = this.fireStore.firestore.collection('List').doc()
    list.set({
      createdAt : new Date(Date.now())
    } as listInterface)
    await this.fireStore.firestore.collection('User').doc(uid).set({
      myList : list,
      friends : [],
      notifications : [],
      username : username,
      createdAt : new Date(Date.now())
     })
  }
}
