import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: User;

  constructor( private _afAuth: AngularFireAuth) { }

  async login(email: string, contrasena: string) {
    try {
      const result = await this._afAuth.signInWithEmailAndPassword(email, contrasena);
      return result;
    }
    catch (error) {
      console.log(error);
      return '';
    }
    
  }

  async register(email: string, contrasena: string) {
    try {
      const result = await this._afAuth.createUserWithEmailAndPassword(email, contrasena);
      this.sendVerificationEmail();
      return result;
    }
    catch (error) {
      console.log(error);
      return '';
    }
  }

  async logOut() {
    try {
      await this._afAuth.signOut();
    }
    catch(error) {
      console.log(error);
    }
  }
  
  async sendVerificationEmail() {
    return (await this._afAuth.currentUser)?.sendEmailVerification();
  }

  getCurrentUser() {
    return this._afAuth.authState.pipe(first()).toPromise()
  }

  async updatePassword(email: string) {
    try {
      return this._afAuth.sendPasswordResetEmail(email);
    }
    catch(error) {
      console.log(error);
      return '';
    }
  }
}
