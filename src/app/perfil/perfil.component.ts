import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditarDatosComponent } from './editar-datos/editar-datos.component';
import {BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { Juego } from '../model/juego';
import { Desarrollador, Jugador } from '../model/usuarios';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  usuario!: string;
  nombre!: string;
  apellidos!: string;
  email!: string;
  foto_perfil!: string;
  rol!: string | null;

  JuegosList!: Juego[];
  UserList: any[] = [];

  changeLayout: boolean = false;

  constructor(public dialog: MatDialog,
              public breakpointObserver: BreakpointObserver,
              private _authService: AuthService,
              private _router: Router,
              private _userService: UsuariosService) {}
  
  ngOnInit(): void {
    this.cargarUsuario();
    this.getRol();
    this.breakpointObserver
      .observe(['(min-width: 471px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.changeLayout = false;
        } else {
          this.changeLayout = true;
        }
      });
  }

  downloadMyFile(path: string, file: string){
    const link = document.createElement('a');
    link.setAttribute('href', path);
    link.setAttribute('download', file);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getRol(){
    this.rol = sessionStorage.getItem("Rol");
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(EditarDatosComponent, {
      width: '600px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        usuario: this.usuario,
        nombre: this.nombre,
        apellidos: this.apellidos
      }
    });
  }

  cargarUsuario(){
    let idUsuario = sessionStorage.getItem("Id Usuario");
    let rol = sessionStorage.getItem("Rol");
    if (idUsuario !== null && rol !== null) {
      if (rol == "jugador") {
        this._userService.getUser(idUsuario).subscribe({
          next: (data: any) => {
            let user = data[0];
            this.usuario = user.Nombre_usuario;
            this.nombre = user.Nombre;
            this.apellidos = user.Apellidos;
            this.email = user.Email;
            if (!user.Foto_perfil) {
              this.foto_perfil = "../../assets/img/Iconos/MainFotoPerfil.png"
            } else {
              this.foto_perfil = user.Foto_perfil;
            }
            this.cargarJuegosUsuario(parseInt(idUsuario));
          }
        })
      } else if (rol == "desarrollador") {
        this._userService.getDev(idUsuario).subscribe({
          next: (data: any) => {
            let user = data[0];
            this.usuario = user.Nombre_usuario;
            this.nombre = user.Nombre;
            this.apellidos = user.Apellidos;
            this.email = user.Email;
            if (!user.Foto_perfil) {
              this.foto_perfil = "../../assets/img/Iconos/MainFotoPerfil.png"
            } else {
              this.foto_perfil = user.Foto_perfil;
            }
            this.cargarJuegoDev(parseInt(idUsuario));
          }
        })
      } else if (rol == "administrador") {
        this._userService.getAdmin(idUsuario).subscribe({
          next: (data: any) => {
            let user = data[0];
            this.usuario = user.Nombre_Usuario;
            this.nombre = user.Nombre;
            this.apellidos = user.Apellidos;
            this.email = user.Email;
            if (!user.Foto_perfil) {
              this.foto_perfil = "../../assets/img/Iconos/MainFotoPerfil.png"
            } else {
              this.foto_perfil = user.Foto_perfil;
            }
            this.cargarUsuarios();
          }
        })
      }
    }
  }

  cargarJuegosUsuario(id: number) {
    this._userService.getJuegosCompradosPor(id).subscribe({
      next: (data: Juego[]) => {
        this.JuegosList = data;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  cargarJuegoDev(id: number) {
    this._userService.getJuegosHechosPor(id).subscribe({
      next: (data: Juego[]) => {
        this.JuegosList = data
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  cargarUsuarios() {
    this._userService.getAllUsers().subscribe({
      next: (data: Jugador[]) => {
        for(let jugador of data) {
          this.UserList.push(jugador);
        }
        this._userService.getAllDevs().subscribe({
          next: (data: Desarrollador[]) => {
            for (let desarrollador of data) {
              this.UserList.push(desarrollador);
            }
          }
        })
      }
    })
  }

  async logout() {
    this._authService.logOut();
    sessionStorage.removeItem("Email");
    sessionStorage.removeItem("Verificado");
    sessionStorage.removeItem("Id Usuario");
    sessionStorage.removeItem("UID");
    sessionStorage.removeItem("Rol");
    await this._router.navigateByUrl("home").then(() => {
      window.location.reload();
    })
  }
}
