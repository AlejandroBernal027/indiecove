import {BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutMobileComponent } from './checkout-mobile/checkout-mobile.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JuegoService } from '../services/juego.service';
import { Juego } from '../model/juego';
import { ComprasService } from '../services/compras.service';
import { Compras } from '../model/compras';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})

export class CarritoComponent implements OnInit{
  
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

  // Precio de la compra sin descuento, cantidad de dinero descontado y el precio final
  precioSinDesc: number = 0;
  precioTotal: number = 0;
  precioDesc: number = 0;

  // Lista de juegos que se muestra por pantalla
  juegos: Juego[] = []

  // Formularios de pago
  datosFacturaForm!: FormGroup;
  pagoTarjetaForm!: FormGroup;
  pagoPrepagoForm!: FormGroup;

  // Variables para hacer la página lo más responsive posible
  changeLayout: boolean = false;
  smallerLayout: boolean = false;
  mobileLayout: boolean = false;
  
  constructor(public breakpointObserver: BreakpointObserver, 
              public dialog: MatDialog,
              private _fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private _juegoService: JuegoService,
              private _compraService: ComprasService) {
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

  ngOnInit(): void {
    this.cargarJuegos()
    // Los breakpointObserver sirven para hacer cambios en la página dependiendo del tamaño de esta
    this.breakpointObserver
      .observe(['(min-width: 1101px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.changeLayout = false;
        } else {
          this.changeLayout = true;
        }
      });

    this.breakpointObserver
      .observe(['(min-width: 861px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallerLayout = false;
        } else {
          this.smallerLayout = true;
          this.changeLayout = false;
        }
      });

    this.breakpointObserver
      .observe(['(min-width: 676px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobileLayout = false;
        } else {
          this.mobileLayout = true;
          this.smallerLayout = false;
        }
      });
  }

  // Esta función calcula el precio total de la compra, el dinero descontado y el precio sin descuento
  calcPrecio() {
    this.precioDesc = 0;
    this.precioTotal = 0;
    this.precioSinDesc = 0;
    for (let juego of this.juegos){
      this.precioSinDesc += juego.Precio;
      if (juego.Rebaja > 0) {
        let rebaja = juego.Rebaja/100;
        this.precioDesc += Math.round((juego.Precio*rebaja)*100)/100;
        this.precioTotal += Math.round((juego.Precio-(juego.Precio*rebaja))*100)/100;
      } else {
        this.precioTotal += juego.Precio;
      }
    }
  }

  // Esta funcion carga los juegos que estén en el carrito
  cargarJuegos() {
    let cantidadCarrito = JSON.parse(sessionStorage.getItem("cantidadCarrito")!);
    if (cantidadCarrito !== null) {
      for (let elemento of cantidadCarrito) {
        this._juegoService.getJuego(elemento).subscribe({
          next: (data: any) => {
            console.log(data)
            this.juegos.push(data[0]);
            this.calcPrecio();
          },
          error: (err: any) => {
            console.log(err)
          }
        })
      }
    }
  }

  // Esta función abre el dialog para hacer checkout desde movil
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CheckoutMobileComponent, {
      width: '500px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  
  // Esta función es la que se encarga de hacer la compra de juegos
  realizarcompra() {
    if (this.datosFacturaForm.valid) {
      let verificado = sessionStorage.getItem("Verficado");
      if (verificado == "true"){

        if (this.pagoTarjetaForm.valid || this.pagoPrepagoForm.valid) {
          this.pagoTarjetaForm.reset();
          this.pagoPrepagoForm.reset();
          let idUsuario = sessionStorage.getItem("Id Usuario");
          if (idUsuario !== null) {
            let compra: Compras = {
              idCompras: 0,
              Precio: this.precioTotal,
              Jugadores_idJugadores: parseInt(idUsuario)
            }
            this._compraService.registrarCompra(compra).subscribe({
              next: (data: any) => {
                this.openSnackBarSuccess();
              },
              error: (err: any) => {
                console.log(err);
              }
            });
  
            for (let juego of this.juegos) {
              // Por cada juego añadido se añade a la tabla "jugadores_has_juego" de la base de datos un nuevo dato con un id del juego que haya comprado el usuario y su propio id
              this._compraService.postJugadorHasJuego(parseInt(idUsuario), juego.idJuego).subscribe({
                next: (data: any) => {
                  console.log("juego añadido");
                },
                error: (err: any) => {
                  console.log(err);
                }
              })
            }
            // Cuando realiza la compra, vacia los juegos del carrito
            this.juegos = []
            sessionStorage.setItem("cantidadCarrito", JSON.stringify([]));
            this.calcPrecio();
            this.openSnackBarSuccess();
          }
        } else {
          this.openSnackBarFailed();
        }
      } else {
        this.openSnackBarNoVerificado();
      }
    } else {
      this.openSnackBarFailed();
    }
  }

  // Esta función elemina los elementos del carrito
  deleteElementCarrito(index: number) {
    this.juegos.splice(index, 1);
    let cantidadCarrito = JSON.parse(sessionStorage.getItem("cantidadCarrito")!);
    if (cantidadCarrito !== null) {
      cantidadCarrito.splice(index, 1)
      sessionStorage.setItem("cantidadCarrito", JSON.stringify(cantidadCarrito));
    }
    this.calcPrecio();
  }
  
  // Los snackbar funcionan de la misma manera que los alert, pero no cortan la ejecución de todo hasta que se cierre el alert
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
  
  openSnackBarAddCarrito() {
    this._snackBar.open('Juego añadido al carrito', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  openSnackBarAlreadyCarrito() {
    this._snackBar.open('El juego ya está en el carrito', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  /* Para evitar que los usuarios no verificados hagan cualquier acción se comprueba si el email está verificado o no.
     Si el usuario no está verificado se abrirá este snackbar */
  openSnackBarNoVerificado() {
    this._snackBar.open('Necesitas verificar tu cuenta para realizar esta acción', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }
}