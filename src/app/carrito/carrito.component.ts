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

  precioSinDesc: number = 0;
  precioTotal: number = 0;
  precioDesc: number = 0;

  juegos: Juego[] = [] 
  // = [
  // {nombre: "Balatro", img: "../../assets/img/popularesHome/Balatro.png", precio: 14.99, rebaja: 0},
  //   {nombre: "Enter The Gungeon", img: "../../assets/img/popularesHome/Gungeon.png", precio: 14.99, rebaja: 0},
  //   {nombre: "Rift of The Necrodancer", img: "../../assets/img/novedadesHome/RiftNecrodancer.png", precio: 24.99, rebaja: 0},
  //   {nombre: "Sea Of Stars", img: "../../assets/img/novedadesHome/SeaofStars.png", precio: 19.99, rebaja: 25},
  // ]

  datosFacturaForm!: FormGroup;
  pagoTarjetaForm!: FormGroup;
  pagoPrepagoForm!: FormGroup;

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

  
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CheckoutMobileComponent, {
      width: '500px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  
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
              console.log(idUsuario);
              this._compraService.postJugadorHasJuego(parseInt(idUsuario), juego.idJuego).subscribe({
                next: (data: any) => {
                  console.log("juego añadido");
                },
                error: (err: any) => {
                  console.log(err);
                }
              })
            }
            
            this.juegos = []
            sessionStorage.setItem("cantidadCarrito", JSON.stringify([]));
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

  deleteElementCarrito(index: number) {
    this.juegos.splice(index, 1);
    let cantidadCarrito = JSON.parse(sessionStorage.getItem("cantidadCarrito")!);
    if (cantidadCarrito !== null) {
      cantidadCarrito.splice(index, 1)
      sessionStorage.setItem("cantidadCarrito", JSON.stringify(cantidadCarrito));
    }
    this.calcPrecio();
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

  openSnackBarNoVerificado() {
    this._snackBar.open('Necesitas verificar tu cuenta para realizar esta acción', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }
}