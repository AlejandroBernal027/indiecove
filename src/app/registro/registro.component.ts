import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UsuariosService } from '../services/usuarios.service';
import { Administrador, Desarrollador, Jugador } from '../model/usuarios';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit{

  changeLayout: boolean = false;
  registroForm: FormGroup;

  constructor(public breakpointObserver: BreakpointObserver,
              private _fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private _authSerice: AuthService,
              private _router: Router,
              private _userService: UsuariosService) {
                this.registroForm = this._fb.group({
                  usuario: ['', [Validators.required]],
                  nombre: ['', [Validators.required]],
                  apellidos: ['', [Validators.required]],
                  email: ['', [Validators.required, Validators.email]],
                  contrasena: ['', [Validators.required]],
                  repetirContrasena: ['', [Validators.required]]
                });
              }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 601px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.changeLayout = false;
        } else {
          this.changeLayout = true;
        }
      });
  }
  
  // Esta función manda el registro, depenediendo de los tres primeros carateres se registra un usuario, un desarrollador o un administrador
  sendRegistro() {
    if (this.registroForm.valid) {
      if (this.registroForm.value.contrasena == this.registroForm.value.repetirContrasena) {
        console.log(this.registroForm.value);
        let tipoUsuario = this.registroForm.value.contrasena.slice(0,3);
        let contrasenaReal = this.registroForm.value.contrasena.slice(3);
        if (tipoUsuario === "DEV") {
          this._authSerice.register(this.registroForm.value.email, contrasenaReal);
          let usuario: Desarrollador = {
            idDesarrolladores: 0,
            Email: this.registroForm.value.email,
            Nombre: this.registroForm.value.nombre,
            Apellidos: this.registroForm.value.apellidos,
            Nombre_usuario: this.registroForm.value.usuario,
            Contrasena: contrasenaReal,
            Foto_perfil: null,
            Nombre_Editor: this.registroForm.value.usuario
          }
          this._userService.addDev(usuario).subscribe({
            next: async (data: Desarrollador) => {
              await this._router.navigateByUrl("login").then(() => {
                window.location.reload();
                this.openSnackBarSuccess();
              })
            }
          });
        } else if (tipoUsuario === "ADM") {
          this._authSerice.register(this.registroForm.value.email, contrasenaReal);
          let usuario: Administrador = {
            idAdministradores: 0,
            Email: this.registroForm.value.email,
            Nombre: this.registroForm.value.nombre,
            Apellidos: this.registroForm.value.apellidos,
            Nombre_usuario: this.registroForm.value.usuario,
            Contrasena: contrasenaReal,
            Foto_perfil: null
          }
          this._userService.addAdmin(usuario).subscribe({
            next: async (data: Administrador) => {
              await this._router.navigateByUrl("login").then(() => {
                window.location.reload();
                this.openSnackBarSuccess();
              })
            }
          });
        } else {
          this._authSerice.register(this.registroForm.value.email, this.registroForm.value.contrasena);
          let usuario: Jugador = {
            idJugadores: 0,
            Email: this.registroForm.value.email,
            Nombre: this.registroForm.value.nombre,
            Apellidos: this.registroForm.value.apellidos,
            Nombre_usuario: this.registroForm.value.usuario,
            Contrasena: this.registroForm.value.contrasena,
            Foto_perfil: null
          }
          this._userService.addUser(usuario).subscribe({
            next: async (data: Jugador) => {
              await this._router.navigateByUrl("login").then(() => {
                window.location.reload();
                this.openSnackBarSuccess();
              })
            }
          });
        }
      } else {
        this.openSnackBarFailed()
      }
    } else {
      this.openSnackBarFailed();
    }
  }

  openSnackBarSuccess() {
    this._snackBar.open('Usuario registrado con éxito', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  openSnackBarFailed() {
    this._snackBar.open('No se ha podido registrar al usuario', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

}
