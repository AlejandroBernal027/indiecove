import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout-mobile',
  templateUrl: './checkout-mobile.component.html',
  styleUrl: './checkout-mobile.component.css'
})
export class CheckoutMobileComponent {

  paises: string[] = [
    "España",
    "Alemania",
    "Reino Unido",
    "Francia",
    "Italia",
    "Ucrania",
    "Polonia",
    "Rumanía",
    "Países Bajos",
    "Grecia",
    "Bélgica",
    "República Checa",
    "Portugal",
    "Suecia",
    "Hungría",
    "Bielorrusia",
    "Austria",
    "Suiza"
  ];

  provincias: string[] = [
    'Andalucía',
    'Aragón',
    'Islas Baleares',
    'Canarias',
    'Cantabria',
    'Castilla-La Mancha',
    'Castilla y León',
    'Cataluña',
    'Madrid',
    'Navarra',
    'Valencia',
    'Extremadura',
    'Galicia',
    'País Vasco',
    'Asturias',
    'Murcia',
    'La Rioja',
    'Ceuta',
    'Melilla',
    'Otro'
  ]

  datosFacturaForm!: FormGroup;
  pagoTarjetaForm!: FormGroup;
  pagoPrepagoForm!: FormGroup;

  constructor(private _fb: FormBuilder,
              private _dialogref: DialogRef,
              private _snackBar: MatSnackBar){
    this.datosFacturaForm = this._fb.group({
      nombre: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('([0-9]{8})([A-Z]{1})$')]],
      pais: [null, [Validators.required]],
      provincia: [{value: null, disabled: true}],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')]]
    });
    this.pagoTarjetaForm = this._fb.group({
      nombreTarjeta: ['', [Validators.required]],
      numeroTarjeta: ['', [Validators.required, Validators.pattern('^(?:[0-9][ -]*?){13,16}$')]],
      fechaCaducidad: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
    this.pagoPrepagoForm = this._fb.group({
      codigoTarjeta: ['', [Validators.required, Validators.pattern('^(?:[0-9][ -]*?){13,16}$')]]
    });
  }


  realizarcompra() {
    if (this.datosFacturaForm.valid) {
      console.log(this.datosFacturaForm.value);
      if (this.pagoTarjetaForm.valid) {
        console.log(this.pagoTarjetaForm.value);
        this.pagoTarjetaForm.reset();
        this._dialogref.close(true);
        this.openSnackBarSuccess();
      } else if (this.pagoPrepagoForm.valid) {
        console.log(this.pagoPrepagoForm.value);
        this.pagoPrepagoForm.reset();
        this._dialogref.close(true);
        this.openSnackBarSuccess();
      } else {
        this.openSnackBarFailed();
      }
    } else {
      this.openSnackBarFailed();
    }
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
    this._snackBar.open('Compra realizada con éxito', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

}
