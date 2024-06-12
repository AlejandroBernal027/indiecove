import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Juego } from '../model/juego';
import { ListaDeseadosService } from '../services/lista-deseados.service';
import { UsuariosService } from '../services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-deseados',
  templateUrl: './lista-deseados.component.html',
  styleUrl: './lista-deseados.component.css'
})
export class ListaDeseadosComponent implements OnInit{
  opciones = new FormControl('');

  opcionesList: {opcion: string, valor: string}[] = [{opcion: 'Rebaja', valor: 'rebaja'}, {opcion: 'Alfabético (A-Z)', valor: 'AZ'}, {opcion: 'Alfabético (Z-A)', valor: "ZA"}];

  tablaDatos!: Juego[]; 
  tableData!: Juego[];
  // = [
  //   {nombre: "GRIS", img:"../../assets/img/novedadesHome/Gris.png", tags: "Ambientales, Casual, Aventura, Coloridos", rebaja: 0},
  //   {nombre: "Skul: The Hero Slayer", img:"../../assets/img/novedadesHome/skul.png", tags: "RogueLite, Acción, Plataformas, Pixel-Art", rebaja: 0},
  //   {nombre: "Celeste", img:"../../assets/img/popularesHome/Celeste.png", tags: "Pixel-Art, Plataformas, 2D, Gran Banda Sonora", rebaja: 0},
  //   {nombre: "Enter The Gungeon", img:"../../assets/img/popularesHome/Gungeon.png", tags: "Pixel-Art, Acción, 2D, RogueLite", rebaja: 30},
  //   {nombre: "Hollow Knight", img:"../../assets/img/popularesHome/Hollow.png", tags: "Exploración, Acción, Fantasia Oscura, 2D", rebaja: 0},
  // ]


  @ViewChild('selectOrdenar') selectOrdenar!: MatSelect;

  changeLayout: boolean = false;
  mobileLayout: boolean = false;

  constructor(public breakpointObserver: BreakpointObserver,
              private _userService: UsuariosService,
              private _lista: ListaDeseadosService,
              private _snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.cargarJuegos();
    this.breakpointObserver
    .observe(['(min-width: 1025px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.changeLayout = false;
      } else {
        this.changeLayout = true;
      }
    });
    
    this.breakpointObserver
    .observe(['(min-width: 701px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobileLayout = false;
      } else {
        this.mobileLayout = true;
      }
    });
  }

  cargarJuegos() {
    let idUsuario = sessionStorage.getItem("Id Usuario");
    if (idUsuario !== null) {
      this._lista.getListaDeseados(parseInt(idUsuario)).subscribe({
        next: (data: any) => {
          this._userService.getJuegosDeListaDeseados(data[0].idLista_Deseados).subscribe({
            next: (data: any) => {
              this.tablaDatos = data;
              this.tableData = data;
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
    }
  }

  addCarrito(id: number) {
    let verificado = sessionStorage.getItem("Verficado");
    if (verificado == "true") {
      let cantidadCarrito = JSON.parse(sessionStorage.getItem("cantidadCarrito")!);
      if (!(cantidadCarrito.includes(id))) {
        cantidadCarrito.push(id);
        sessionStorage.setItem("cantidadCarrito", JSON.stringify(cantidadCarrito));
        this.openSnackBarAddCarrito();
        window.location.reload();
      } else {
        this.openSnackBarAlreadyCarrito();
      }
    } else {
      this.openSnackBarNoVerificado()
    }
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

  filtrar(){
    let datosFiltrados: any[] = [];
    let opcion = this.selectOrdenar.value;
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    if (opcion == "AZ") {
      for (let letra of letras) {
        for (let juego of this.tablaDatos) {
          if (juego.Nombre.charAt(0) == letra) {
            if (!(datosFiltrados.includes(juego))){
              datosFiltrados.push(juego);
            }
          }
        }
      }
      this.tableData = datosFiltrados;
    } else if (opcion == "ZA") {
      let letrasReversas = letras.reverse();
      for (let letra of letrasReversas) {
        for (let juego of this.tablaDatos) {
          if (juego.Nombre.charAt(0) == letra) {
            if (!(datosFiltrados.includes(juego))){
              datosFiltrados.push(juego);
            }
          }
        }
      }
      this.tableData = datosFiltrados;
    } else if (opcion == "rebaja") {
      for (let juego of this.tablaDatos) {
        if (juego.Rebaja > 0) {
          datosFiltrados.push(juego);
        }
      }
      for (let juego of this.tablaDatos) {
        if (juego.Rebaja == 0){
          datosFiltrados.push(juego);
        }
      }
      this.tableData = datosFiltrados;
    }
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