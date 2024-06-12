import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { MatRadioButton } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { Juego } from '../model/juego';
import { JuegoService } from '../services/juego.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit{
  genero = new FormControl('');
  generoList: string[] = ['Metroidvania', 'Estrategia', 'Supervivencia', 'Ritmo', 'Acción', 'Casual', 'Ambientales'];
  
  estilo = new FormControl('');
  estiloList: string[] = ['3D', '2D', '2.5D', 'Pixel-Art', 'Colorido'];
  
  plataforma = new FormControl('');
  plataformaList: string[] = ['Steam', 'GOG', 'Epic Games'];
  
  palabrasClave = new FormControl('');
  palabrasClaveList: string[] = ['LGBTQ+', 'Casual', 'Un jugador', 'Multijugador', 'Gran Banda Sonora'];

  minSlider!: string;
  maxSlider!: string;
  actualMinSlider!: number;
  actualMaxSlider!: number;

  @ViewChild('generoSelect') generoSelect!: MatSelect;
  @ViewChild('estiloSelect') estiloSelect!: MatSelect;
  @ViewChild('claveSelect') claveSelect!: MatSelect;

  @ViewChild('button1') popularesRadio!: MatRadioButton;
  @ViewChild('button2') NovedadesRadio!: MatRadioButton;
  @ViewChild('button3') mejoresValoradosRadio!: MatRadioButton;
  @ViewChild('button4') rebajasRadio!: MatRadioButton;

  tablaDatos!: Juego[];
  tableData!: Juego[];

  changeLayout: boolean = false;

  constructor(public breakpointObserver: BreakpointObserver,
              private _juegoService: JuegoService
  ) {}

  ngOnInit(): void {
    this.cargarJuegos();
    this.breakpointObserver
      .observe(['(min-width: 769px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.changeLayout = false;
        } else {
          this.changeLayout = true;
        }
      });
  }

  // Esta función carga todos los juegos de la tienda
  cargarJuegos() {
    this._juegoService.getJuegosList().subscribe({
      next: (val: Juego[]) => {
        this.tablaDatos = val;
        this.tableData = val;
        this.rellenar();
        this.setSlider();
        this.calculoPrecio();
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  // Como usa un space between y no ocupa todo el espacio del div, deja un espacio enorme. Para evitarlo añado elementos vacios.
  rellenar() {
    if (this.tableData.length%4 != 0) {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData.push({
          idJuego: 0,
          Nombre: "relleno",
          Etiquetas: "",
          Fecha_publicacion: "",
          Nombre_Desarrollador: "",
          Precio: 0,
          Rebaja: 0,
          Img_principal: "",
          Img_sec1: "",
          Img_sec2: "",
          Img_sec3: "",
          Img_sec4: "",
          Sinopsis: "relleno",
          Desarrolladores_IdDesarrolladores: 0
        })
        if (this.tableData.length%4 == 0){
          break;
        }
      }
    }
  }

  // Calcula el precio que se muestra en cada juego si tiene rebaja
  calculoPrecio(){
    for (let game of this.tableData) {
      if (game.Rebaja > 0) {
        let precioRebaja = Math.round((game.Precio-(game.Precio*(game.Rebaja/100)))*100)/100;
        if (precioRebaja < this.actualMinSlider) {
          this.actualMinSlider = Math.round(precioRebaja);
          this.minSlider = Math.round(precioRebaja).toString();
        }
        this.tableData[this.tableData.indexOf(game)].Precio = precioRebaja;
      }
    }
  }

  // Esta función filtra los juegos
  filtrar(){
    this.tableData = this.tablaDatos;
    let opciones: string[] = []
    let tableDataFiltrado: Juego[] = [];
    let included: boolean = false;
      for (let genero of this.generoSelect.value) {
        if (!(opciones.includes(genero))) {
          opciones.push(genero)
        }
      }
      for (let clave of this.claveSelect.value) {
        if (!(opciones.includes(clave))) {
          opciones.push(clave)
        }
      }
      for (let estilo of this.estiloSelect.value) {
        if (!(opciones.includes(estilo))) {
          opciones.push(estilo)
        }
      }
      if (opciones.length <= 0) {
        for (let juego of this.tablaDatos){
          if (juego.Precio >= this.actualMinSlider && juego.Precio <= this.actualMaxSlider) {
            tableDataFiltrado.push(juego);
          }
        }
      } else {
        this.tablaDatos.filter((juego) => {
          for (let elemento of opciones) {
            if (juego.Etiquetas.split(", ").includes(elemento) && juego.Precio >= this.actualMinSlider && juego.Precio <= this.actualMaxSlider) {
              included = true;
            } else {
              included = false;
            }
            if (included == false) {
              break;
            }
          }
          if (included == true) {
            tableDataFiltrado.push(juego);
          }
        });
      }
      if (this.popularesRadio.checked == true){
        this.tableData = tableDataFiltrado;
      } else if (this.rebajasRadio.checked == true){
        let juegosRebajas: any[] = [];
        for (let juego of tableDataFiltrado) {
          if (juego.Rebaja > 0 && juego.Precio >= this.actualMinSlider && juego.Precio <= this.actualMaxSlider) {
            juegosRebajas.push(juego);
          }
        }
        this.tableData = juegosRebajas;
      } else if (this.NovedadesRadio.checked == true) {
        this._juegoService.getJuegosListByFecha().subscribe({
          next: (data: Juego[]) => {
            this.tableData = data;
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      } else if (this.mejoresValoradosRadio.checked == true) {        
        this.tableData = tableDataFiltrado.reverse();
      }
      this.rellenar();
  }

  // Esta función sirve para filtrar usando el slider
  sliderValues(value1: string, value2: string) {
    this.actualMinSlider = Math.round(parseInt(value1));
    this.actualMaxSlider = Math.round(parseInt(value2));
    this.filtrar();
  }

  // Esta función introduce los valores máximos y mínimos del slider.
  setSlider() {
    let max = 0;
    let min = 999;
    for (let juego of this.tablaDatos) {
      if (juego.Nombre != "relleno"){
        if (juego.Precio > max) {
          max = juego.Precio;
        }
        if (juego.Precio < min) {
          min = juego.Precio;
        }
      }
    }
    this.minSlider = (Math.round(min)-1).toString();
    this.maxSlider = Math.round(max).toString();
    this.actualMinSlider = (Math.round(min));
    this.actualMaxSlider = Math.round(max);
  }

}
