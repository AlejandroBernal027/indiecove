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

  // Esta función hace el login con firebase
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

  // Esta función hace el registro con firebase
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

  // Esta función hace el logout con firebase
  async logOut() {
    try {
      await this._afAuth.signOut();
    }
    catch(error) {
      console.log(error);
    }
  }
  
  // Esta función manda el email de verificación
  async sendVerificationEmail() {
    return (await this._afAuth.currentUser)?.sendEmailVerification();
  }

  // Esta función obtiene el usuario actual
  getCurrentUser() {
    return this._afAuth.authState.pipe(first()).toPromise()
  }

  // Esta función manda un email para cambiar la contraseña con firebase
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
