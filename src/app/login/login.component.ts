import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContrasenaOlvidadaComponent } from './contrasena-olvidada/contrasena-olvidada.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { Administrador, Desarrollador, Jugador } from '../model/usuarios';
import { ListaDeseadosService } from '../services/lista-deseados.service';
import { ListaDeseados } from '../model/lista-deseados';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(public dialog: MatDialog,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _lista: ListaDeseadosService,
    private _userService: UsuariosService
    ) {
      this.loginForm = this._fb.group({
        email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required]],
        contrasena: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]{8,50}')]]
      })
    }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ContrasenaOlvidadaComponent, {
      width: '500px',
      height: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openSnackBarFailed() {
    this._snackBar.open('El formulario no es válido', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  openSnackBarSuccess() {
    this._snackBar.open('Login realizado correctamente', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  // Esta función manda los datos para iniciar sesión
  async sendLogin() {
    if (this.loginForm.valid) {
      let rol = this.loginForm.value.contrasena.slice(0, 3);
      let contrasenaReal = this.loginForm.value.contrasena.slice(3);
      if (rol === "DEV"){
        this._userService.loginDev(this.loginForm.value.email).subscribe({
          next: (userBD: any) => {
            console.log(userBD);
            sessionStorage.setItem("Id Usuario", userBD[0].idDesarrolladores.toString());
            this._authService.login(this.loginForm.value.email, contrasenaReal);
            this._authService.getCurrentUser().then(async (user) => {
              if (user) {
                console.log('usuario:' , user);
                sessionStorage.setItem("Email", user.email!);
                sessionStorage.setItem("Verificado", user.emailVerified.toString());
                sessionStorage.setItem("UID", user.uid);
                sessionStorage.setItem("Rol", "desarrollador");
                await this._router.navigateByUrl("home").then(() => {
                  window.location.reload();
                })
              }
            });
          }
        });
      } else if (rol === "ADM") {
        this._userService.loginAdmin(this.loginForm.value.email).subscribe({
          next: (userBD: any) => {
            console.log(userBD);
            sessionStorage.setItem("Id Usuario", userBD[0].idAdministradores.toString());
            this._authService.login(this.loginForm.value.email, contrasenaReal);
            this._authService.getCurrentUser().then(async (user) => {
              if (user) {
                console.log('usuario:' , user);
                sessionStorage.setItem("Email", user.email!);
                sessionStorage.setItem("Verificado", user.emailVerified.toString());
                sessionStorage.setItem("UID", user.uid);
                sessionStorage.setItem("Rol", "administrador");
                await this._router.navigateByUrl("home").then(() => {
                  window.location.reload();
                })
              }
            });
          }
        });
      } else {
        this._userService.loginUser(this.loginForm.value.email).subscribe({
          next: (userBD: any) => {
            sessionStorage.setItem("Id Usuario", userBD[0].idJugadores.toString());
            this._authService.login(this.loginForm.value.email, this.loginForm.value.contrasena);
            this._authService.getCurrentUser().then(async (user) => {
              if (user) {
                console.log('usuario:' , user);
                sessionStorage.setItem("Email", user.email!);
                sessionStorage.setItem("Verificado", user.emailVerified.toString());
                sessionStorage.setItem("UID", user.uid);
                sessionStorage.setItem("Rol", "jugador");
                let idUsuario = sessionStorage.getItem("Id Usuario");
                if (idUsuario !== null) {
                  let lista: ListaDeseados = {
                    idLista_Deseados: 0,
                    Jugadores_idjugadores: parseInt(idUsuario)
                  }
                  this._lista.makeListaDeseados(lista).subscribe({
                    next: async (data: any) => {
                      await this._router.navigateByUrl("home").then(() => {
                        window.location.reload();
                      })
                    },
                    error: async (err: any) => {
                      await this._router.navigateByUrl("home").then(() => {
                        window.location.reload();
                      })
                    }
                  })
                }
                
              }
            });
          }
        });
      }
    } else {
      this.openSnackBarFailed();
    }
  }
}