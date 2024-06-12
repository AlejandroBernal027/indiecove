import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import {BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';
import { Juego } from '../model/juego';
import { JuegoService } from '../services/juego.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Valoracion } from '../model/valoracion';
import { ValoracionService } from '../services/valoracion.service';
import { UsuariosService } from '../services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListaDeseadosService } from '../services/lista-deseados.service';

@Component({
  selector: 'app-detalles-juego',
  templateUrl: './detalles-juego.component.html',
  styleUrl: './detalles-juego.component.css'
})
export class DetallesJuegoComponent implements OnInit{

  srcMainImg!: string;
  valoracionForm!: FormGroup;
  juego!: Juego;
  rol!: string | null;
  nombreUsuario!: string;
  idUsuario!: string | null;
  idJuego!: number;
  haValorado: boolean = false;

  @ViewChild('textarea') comentario!: ElementRef<HTMLTextAreaElement>

  valoracionPuntuacion: string[] =['0 estrellas', '1 estrellas', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas']
  valoraciones!: Valoracion[];

  changeLayout: boolean = false;
  mobileLayout: boolean = false;

  constructor(public breakpointObserver: BreakpointObserver,
              private _juegoService: JuegoService,
              private _route: ActivatedRoute,
              private _fb: FormBuilder,
              private _valoracionService: ValoracionService,
              private _userService: UsuariosService,
              private _snackBar: MatSnackBar,
              private _lista: ListaDeseadosService
  ) {
    this.valoracionForm = this._fb.group({
      puntuacion: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.cargarJuego();
    this.rol = sessionStorage.getItem("Rol");
    // los breakpointObserver los uso para que la página sea más responsive
    this.breakpointObserver
      .observe(['(min-width: 769px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.changeLayout = false;
        } else {
          this.changeLayout = true;
        }
      });

    this.breakpointObserver
      .observe(['(min-width: 321px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobileLayout = false;
        } else {
          this.mobileLayout = true;
          this.changeLayout = false;
        }
      });
  }

  // Esta funcion cambia la imagen principal de la gridlist dependiendo del src que se le pase. Todos los src de la base de datos son imgenes en base64. 
  changeMainImgSrc(src: string) {
    this.srcMainImg = src;
  }

  // Esta funcion, dependiendo del id que tenga, carga un juego u otro junto a sus valoraciones. 
  cargarJuego() {
    this._route.params.subscribe(params => {
      this.idJuego = params['id'];
      this._juegoService.getJuego(this.idJuego.toString()).subscribe({
        next: (data: any) => {
          this.juego = data[0];
          this.srcMainImg = this.juego.Img_principal;
          this._valoracionService.getValoracionesListByGameId(this.idJuego).subscribe({
            next: (data: Valoracion[]) => {
              this.valoraciones = data;
              this.idUsuario = sessionStorage.getItem("Id Usuario");
              if (this.idUsuario !== null){
                this._userService.getUser(this.idUsuario).subscribe({
                  next: (data: any) => {
                    this.idUsuario = data[0].idJugadores.toString();
                    this.nombreUsuario = data[0].Nombre_usuario;
                    for (let valoracion of this.valoraciones) {
                      if (this.idUsuario !== null && valoracion.Jugadores_idJugadores.toString() == this.idUsuario) {
                        this.haValorado = true;
                      } else {
                        this.haValorado = false;
                      }
                    }
                  }
                })
              }
            },
            error: (err: any) => {
              console.log(err);
            }
          })
        },
        error: (err: any) => {
          console.log(err)
        }
      })
    })
  }

  // Esta función manda la valoración que haya escrito un usuario.
  mandarValoracion() {
    let verificado = sessionStorage.getItem("Verificado");
    if (this.valoracionForm.valid) {
      if (verificado == "true") {
        if (this.idUsuario !== null) {
          let valoracion: Valoracion = {
            idValoracion: 0,
            Nombre_usuario: this.nombreUsuario,
            Puntuacion: this.valoracionForm.value.puntuacion,
            Comentario: this.comentario.nativeElement.value,
            Juego_idJuego: this.juego.idJuego,
            Jugadores_idJugadores: parseInt(this.idUsuario)
          }
          this._valoracionService.addValoracion(valoracion).subscribe({
            next: (data: Valoracion) => {
              window.location.reload();
            },
            error: (err: any) => {
              console.log(err);
            }
          });
        }
      } else {
        this.openSnackBarNoVerificado()
      }
    }
  }

  // Esta función añade al carrito el juego, si no está dentro ya
  addCarrito(id: number) {
    let verificado = sessionStorage.getItem("Verificado");
    
    if (verificado == "true") {
      let cantidadCarrito = JSON.parse(sessionStorage.getItem("cantidadCarrito")!);
      if (!(cantidadCarrito.includes(id))) {
        cantidadCarrito.push(id);
        sessionStorage.setItem("cantidadCarrito", JSON.stringify(cantidadCarrito));
        this.openSnackBarAddCarrito();
      } else {
        this.openSnackBarAlreadyCarrito();
      }
    } else {
      this.openSnackBarNoVerificado()
    }
  }

  // Esta función añade a la lsita de deseados el juego, si no está dentro ya
  addListaDeseados() {
    let verificado = sessionStorage.getItem("Verificado");
    console.log(verificado);
    if (verificado == "true"){
      let idUsuario = sessionStorage.getItem("Id Usuario")
      if (idUsuario !== null) {
        this._lista.getListaDeseados(parseInt(idUsuario)).subscribe({
          next: (data: any) => {
            console.log(data[0]);
            this._lista.addJuego(data[0], this.idJuego).subscribe({
              next: (data: any) => {
                this.openSnackBarAddLista();
              },
              error: (err: any) => {
                this.openSnackBarAlreadyLista();
              }
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      }
    } else {
      this.openSnackBarNoVerificado()
    }
  }

  // Estas funciones hacen que se aparezcan las snackbars correspondientes al resultado de la acción.
  openSnackBarAddCarrito() {
    this._snackBar.open('Juego añadido al carrito', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  openSnackBarAddLista() {
    this._snackBar.open('Juego añadido a la lista de deseados', '', {
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

  openSnackBarAlreadyLista() {
    this._snackBar.open('El juego ya está en la lista de deseados', '', {
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
