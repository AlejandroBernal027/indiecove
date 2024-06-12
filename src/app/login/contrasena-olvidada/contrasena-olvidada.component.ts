import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contrasena-olvidada',
  templateUrl: './contrasena-olvidada.component.html',
  styleUrl: './contrasena-olvidada.component.css'
})
export class ContrasenaOlvidadaComponent {

  editContrasena: FormGroup;

  constructor(private _fb: FormBuilder, private _auth: AuthService){
    this.editContrasena = this._fb.group({
      email:['', [Validators.required]]
     })
  }

  submitNuevaContrasena() {
    if (this.editContrasena.valid) {
      if (this.editContrasena.value.email == "") {
        this._auth.updatePassword(this.editContrasena.value.email);
      }
    }

  }
}
