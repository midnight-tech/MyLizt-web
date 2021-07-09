import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/data/interfaces';
import { time } from 'uniqid'
import { UserConverter } from 'src/app/data/converters';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLogged: boolean = false
  user: firebase.User | null = null
  userFirestore: UserInterface | null = null
  authLoaded = false
  unsub!: Function


  constructor(public fireAuth: AngularFireAuth, public fireStore: AngularFirestore, private router: Router, ngZone: NgZone) {
    fireAuth.onAuthStateChanged((user) => {
      ngZone.run(() => {
        if (user) {
          if (user.emailVerified == false) {
            router.navigate(['verification'])
            return
          }
          this.user = user
          this.isLogged = true
          fireStore.firestore.collection('User').doc(user.uid).withConverter(UserConverter).get().then((value) => {
            this.userFirestore = value.data()!
            router.navigate(['home']).then((value) => {
              this.authLoaded = true;
            })
          })
          return
        }
        router.navigate(["/"])
        this.isLogged = false
        this.user = user
        this.authLoaded = true;
      })
    })
  }

  async signIn(email: string, password: string) {
    let user = await this.fireAuth.signInWithEmailAndPassword(email, password)
    console.log(user)
    if (user.user?.emailVerified == false) {
      console.log("redirect")
      this.isLogged = false
      this.router.navigate(['verification'])
      await user.user.sendEmailVerification()
      await this.fireAuth.signOut()
    }

  }

  async signInWithGoogle() {
    let user = await this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    if (user.additionalUserInfo?.isNewUser) {
      await this.initUser(user.user?.uid!!, user.user?.displayName!!)
    }
  }

  async signInWithFacebook() {
    const user = await this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    if (user.additionalUserInfo?.isNewUser) {
      await this.initUser(user.user?.uid!!, user.user?.displayName!!)
    }
  }

  async signInWithTwitter() {
    const user = await this.fireAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
    if (user.additionalUserInfo?.isNewUser) {
      await this.initUser(user.user?.uid!!, user.user?.displayName!!)
    }
  }

  async signInWithApple() {
    throw "Not implemented"
  }

  async signUpWithEmail(userName: string, email: string, password: string) {
    let user = await this.fireAuth.createUserWithEmailAndPassword(email, password)
    await user.user?.sendEmailVerification()
    await user.user?.updateProfile({ displayName: userName })
    if (user.additionalUserInfo?.isNewUser) {
      await this.initUser(user.user?.uid!!, user.user?.displayName!!)
      this.isLogged = false
      this.router.navigate(['verification'])
      await this.fireAuth.signOut()
    }
  }

  async logout() {
    await this.fireAuth.signOut()
    this.unsub()
  }

  async resetPassword(email: string) {
    try {
      await this.fireAuth.sendPasswordResetEmail(email)
      return {
        correct: true,
        message: "email sent"
      }
    } catch (e) {
      return {
        correct: false,
        message: e.message as string
      }
    }
  }

  async initUser(uid: string, username: string) {
    let list = this.fireStore.firestore.collection('List').doc()
    let user = this.fireStore.firestore.collection('User').doc(uid)
    await firebase.firestore().runTransaction(async (transaction) => {
      transaction.set(list, {
        createdAt: new Date(Date.now()),
        animeCount: 0,
        animeCountRec: 0,
        bookCount: 0,
        bookCountRec: 0,
        serieCount: 0,
        serieCountRec: 0
      })
      transaction.set(user, {
        applicationUserId: time(),
        myList: list,
        friends: [],
        notifications: [],
        username: username,
        createdAt: new Date(Date.now())
      })
    })
  }
}
