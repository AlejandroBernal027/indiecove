import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Administrador, Desarrollador, Jugador } from '../../model/usuarios';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrl: './editar-datos.component.css'
})
export class EditarDatosComponent implements OnInit{
  
  editDatos: FormGroup;
  editContrasena: FormGroup;
  base64Img!: any;
  fileName = '';

  constructor(private _fb: FormBuilder,
    private _dialogref: DialogRef, 
    private _auth: AuthService,
    private _userService: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: {usuario: string, nombre: string, apellidos: string}){
    this.editDatos = this._fb.group({
      usuario:['', [Validators.required]],
      nombre:['', [Validators.required]],
      apellidos:['', [Validators.required]],
   }),
   this.editContrasena = this._fb.group({
    email:['', [Validators.required]]
   })
 }

  ngOnInit(): void {
    this.editDatos.patchValue(this.data);
  }

  // Esta función manda los nuevos datos introducidos por el usuario
  submitNuevosDatos() {
    let rol = sessionStorage.getItem("Rol");
    let idUsuario = sessionStorage.getItem("Id Usuario");
    if (this.editDatos.valid && rol !== null && idUsuario !== null) {
      if (this.fileName != ""){
        if (rol == "jugador") {
          let nuevosDatos: Jugador = {
            idJugadores: parseInt(idUsuario),
            Email: '',
            Nombre: this.editDatos.value.nombre,
            Apellidos: this.editDatos.value.apellidos,
            Nombre_usuario: this.editDatos.value.usuario,
            Contrasena: '',
            Foto_perfil: this.base64Img
          }
          this._userService.updateDatosUser(nuevosDatos).subscribe({
            next: (data: any) => {
              this._dialogref.close(true);
              window.location.reload();
            }
          })
        } else if (rol == "desarrollador") {
          let nuevosDatos: Desarrollador = {
            idDesarrolladores: parseInt(idUsuario),
            Email: '',
            Nombre: this.editDatos.value.nombre,
            Apellidos: this.editDatos.value.apellidos,
            Nombre_usuario: this.editDatos.value.usuario,
            Contrasena: '',
            Foto_perfil: this.base64Img,
            Nombre_Editor: ''
          }
          this._userService.updateDatosDev(nuevosDatos).subscribe({
            next: (data: any) => {
              this._dialogref.close(true);
              window.location.reload();
            }
          })
        } else if (rol == "administrador") {
          let nuevosDatos: Administrador = {
            idAdministradores: parseInt(idUsuario),
            Email: '',
            Nombre: this.editDatos.value.nombre,
            Apellidos: this.editDatos.value.apellidos,
            Nombre_usuario: this.editDatos.value.usuario,
            Contrasena: '',
            Foto_perfil: this.base64Img
          }
          this._userService.updateDatosAdmin(nuevosDatos).subscribe({
            next: (data: any) => {
              this._dialogref.close(true);
              window.location.reload();
            }
          })
        }
      } else {
        if (rol == "jugador") {
          let nuevosDatos: Jugador = {
            idJugadores: parseInt(idUsuario),
            Email: '',
            Nombre: this.editDatos.value.nombre,
            Apellidos: this.editDatos.value.apellidos,
            Nombre_usuario: this.editDatos.value.usuario,
            Contrasena: '',
            Foto_perfil: null
          }
          this._userService.updateDatosUser(nuevosDatos).subscribe({
            next: (data: any) => {
              this._dialogref.close(true);
              window.location.reload();
            }
          })
        } else if (rol == "desarrollador") {
          let nuevosDatos: Desarrollador = {
            idDesarrolladores: parseInt(idUsuario),
            Email: '',
            Nombre: this.editDatos.value.nombre,
            Apellidos: this.editDatos.value.apellidos,
            Nombre_usuario: this.editDatos.value.usuario,
            Contrasena: '',
            Foto_perfil: null,
            Nombre_Editor: ''
          }
          this._userService.updateDatosDev(nuevosDatos).subscribe({
            next: (data: any) => {
              this._dialogref.close(true);
              window.location.reload();
            }
          })
        } else if (rol == "administrador") {
          let nuevosDatos: Administrador = {
            idAdministradores: parseInt(idUsuario),
            Email: '',
            Nombre: this.editDatos.value.nombre,
            Apellidos: this.editDatos.value.apellidos,
            Nombre_usuario: this.editDatos.value.usuario,
            Contrasena: '',
            Foto_perfil: null
          }
          this._userService.updateDatosAdmin(nuevosDatos).subscribe({
            next: (data: any) => {
              this._dialogref.close(true);
              window.location.reload();
            }
          })
        }
      }
      this._dialogref.close(true)
    } else {
      alert("El formulario de cambio de datos no es válido");
    }
  }

  // Manda un email para cambiar la contraseña
  submitNuevaContrasena() {
    if (this.editContrasena.valid) {
      if (this.editContrasena.value.email == "") {
        this._auth.updatePassword(this.editContrasena.value.email);
        this._dialogref.close(true);
      }
    }

  }

  // Pasa la imagen de perfil a base64
  onFileSelected(event: any) {
    const file:File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      console.log(file);
      if (file.type == "image/png" || file.type == "image/jpeg") {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.base64Img = reader.result;
          console.log(this.base64Img);
        };
      reader.readAsDataURL(file as Blob);
      }
    }
}
}
