import { CollectionReference, DocumentReference, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import {} from "firebase"
import { UserInterface } from "./interfaces";



export const UserConverter = {
    toFirestore: function (user : UserInterface){
        return {
            ...user
        }
    },
    fromFirestore : function (snapshot :  QueryDocumentSnapshot<any>, options : SnapshotOptions) {
        return snapshot.data(options) as UserInterface
    }
}

interface FriendFire {
    friendId: string
    reference : DocumentReference
}

export const friendConverter = {
    toFirestore: function (friend : FriendFire){
        return {
            ...friend
        }
    },
    fromFirestore : function (snapshot :  QueryDocumentSnapshot<any>, options : SnapshotOptions) {
        return snapshot.data(options) as FriendFire
    }
}