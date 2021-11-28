import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { promise } from 'selenium-webdriver';
import firebase from 'firebase/app';
import { first } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
//import { Profile } from '../models/profile.model';
import { Profile } from 'src/app/models/profile.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userId: string;
  profileRef: AngularFireList<Profile> = null;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) { }

  getUser(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  getuid() {
    return firebase.auth().currentUser.uid;
  }

  signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signUp(email: string, password: string, profile: Profile): Promise<firebase.auth.UserCredential> {
    try {
      const newUserCredential: firebase.auth.UserCredential =
        await this.afAuth.createUserWithEmailAndPassword(email, password);

      //write data to realtime database
      const path = '/profile/' + newUserCredential.user.uid;
      await this.db.object(path).set(profile);
      return newUserCredential;
    }

    catch (error) {
      throw error;
    }
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  userDetails() {
    return this.afAuth.user;
  }
}
  // VERSI REACTIVE FORMS
  // constructor(
  //   private fireAuth: AngularFireAuth
  // ) { }

  // signUp(value) {
  //   return new Promise<void>((resolve, reject) => {
  //     this.fireAuth.createUserWithEmailAndPassword(value.email, value.password)
  //       .then(
  //         res => resolve(res),
  //         err => reject(err)
  //       );
  //   });
  // }


  // signIn(value) {
  //   return new Promise<void>((resolve, reject) => {
  //     this.fireAuth.signInWithEmailAndPassword(value.email, value.password)
  //       .then(
  //         res => resolve(res),
  //         err => reject(err)
  //       );
  //   });
  // }


  // logout() {
  //   return new Promise<void>((resolve, reject) => {
  //     if (this.fireAuth.currentUser) {
  //       this.fireAuth.signOut()
  //         .then(() => {
  //           console.log('Log Out');
  //           resolve();
  //         }).catch((error) => {
  //           reject();
  //         });
  //     }
  //   });
  // }


  // userDetails() {
  //   return this.fireAuth.user;
  // }




//}
