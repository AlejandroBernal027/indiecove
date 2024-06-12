import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { JuegoService } from '../services/juego.service';
import { JuegoSearch } from '../model/juego';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  
  cantidadCarrito: number[] = [];
  changeLayout: boolean = false;

  tablaDatos!: JuegoSearch[];

  rol!: string | null;
  idUser!: string | null;
  filteredOptions!: Observable<JuegoSearch[]>;
  myControl = new FormControl('');

  constructor(public breakpointObserver: BreakpointObserver,
              private _authService: AuthService,
              private _juegoService: JuegoService) {}
  
  async ngOnInit() {
    this.setCantidadCarrito();
    this.getUserIDAndRole();
    this.cargarJuegoSearch();
    
    // los breakpointObserver los uso para que la página sea más responsive
    this.breakpointObserver
      .observe(['(min-width: 551px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.changeLayout = false;
        } else {
          this.changeLayout = true;
        }
      });
  }

  // Esta función coge el rol del usuario y su id para mostrar diferentes elementos del header
  getUserIDAndRole(){
    this.idUser = sessionStorage.getItem("Id Usuario");
    this.rol = sessionStorage.getItem("Rol");
    console.log(this.rol);
  }

  // Esta función sirve para que el input de busqueda de juegos funcione
  autocompletado(value: string): JuegoSearch[] {
    const filterValue = value.toLowerCase();
    return this.tablaDatos.filter(juego => juego.Nombre.toLowerCase().includes(filterValue));
  }
  
  // Esta función inicia el carrito si no está inciado ya y lo deja como tal si está iniciado 
  setCantidadCarrito() {
    this.cantidadCarrito = JSON.parse(sessionStorage.getItem("cantidadCarrito")!);
    if (this.cantidadCarrito === null) {
      this.cantidadCarrito = [];
      sessionStorage.setItem("cantidadCarrito", JSON.stringify(this.cantidadCarrito));
    } else {
      sessionStorage.setItem("cantidadCarrito", JSON.stringify(this.cantidadCarrito));
    }

    this.rol = sessionStorage.getItem("Rol");
    if (this.rol === null) {
      sessionStorage.setItem("Rol", JSON.stringify(null));
    }
  }
  
  // Esta función carga los juegos para mostrarlos en el input del autocompletado
  cargarJuegoSearch() {
    this._juegoService.getJuegosBusqueda().subscribe({
      next: (data: JuegoSearch[]) => {
        this.tablaDatos = data;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) => this.autocompletado(value || '')),
        );
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}
