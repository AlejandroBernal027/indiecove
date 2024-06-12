import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  // Hay un problema en el home, es que no tiene datos dinámicos y todo es estático

  carruselImgs: string[] = [
    '../../assets/img/carruselHome/CelesteCarrusel.jpg',
    '../../assets/img/carruselHome/InStarsAndTimeCarrusel.png',
    '../../assets/img/carruselHome/SeaOfStarsCarrusel.png',
    '../../assets/img/carruselHome/InscryptionCarrusel.png',
    '../../assets/img/carruselHome/KatanaZeroCarrusel.png',
    '../../assets/img/carruselHome/BalatroCarrusel.png',
    '../../assets/img/carruselHome/SkulCarrusel.png'
  ]

  carruselImgsID: number[] = [17, 4, 8, 14, 20, 13, 10];

  radioCheck: boolean[] = [true, false, false, false, false, false, false]
  
  srcImgIzq: string = this.carruselImgs[6];
  idImgIzq: number = this.carruselImgsID[6]
  srcImgCen: string = this.carruselImgs[0];
  idImgCen: number = this.carruselImgsID[0]
  srcImgDer: string = this.carruselImgs[1];
  idImgDer: number = this.carruselImgsID[1];
  
  novedadesList: {nombre: string, img: string, rebaja: number, id: number}[] = [
    {nombre: "Urbano - Legends' Debut", img: "../../assets/img/novedadesHome/urbano.jpg", rebaja: 0, id: 1},
    {nombre: "Everhood", img: "../../assets/img/novedadesHome/everhood.jpg", rebaja: 0, id: 2},
    {nombre: "Rift of The Necrodancer", img: "../../assets/img/novedadesHome/RiftNecrodancer.png", rebaja: 0, id: 3},
    {nombre: "In Stars and Time", img: "../../assets/img/carruselHome/InStarsAndTimeCarrusel.png", rebaja: 0, id: 4},
    {nombre: "Earthblade", img: "../../assets/img/novedadesHome/earthblade.png", rebaja: 0, id: 5},
    {nombre: "GRIS", img: "../../assets/img/novedadesHome/Gris.png", rebaja: 0, id: 6},
    {nombre: "Pit People", img: "../../assets/img/novedadesHome/Pitpeople.png", rebaja: 0, id: 7},
    {nombre: "Sea of Stars", img: "../../assets/img/novedadesHome/SeaofStars.png", rebaja: 25, id: 8},
    {nombre: "Bloons TD6", img: "../../assets/img/novedadesHome/Bloons6.png", rebaja: 0, id: 9},
    {nombre: "Skul: The Hero Slayer", img: "../../assets/img/carruselHome/SkulCarrusel.png", rebaja: 0, id: 10},
  ]

  popularesList: {nombre: string, img: string, rebaja: number, id: number}[] = [
    {nombre: "Hollow Knight", img: "../../assets/img/popularesHome/Hollow.png", rebaja: 0, id: 11},
    {nombre: "Celeste", img: "../../assets/img/carruselHome/CelesteCarrusel.jpg", rebaja: 0, id: 17},
    {nombre: "Enter the Gungeon", img: "../../assets/img/popularesHome/Gungeon.png", rebaja: 0, id: 22},
    {nombre: "Wizard with a gun", img: "../../assets/img/popularesHome/WizardGun.png", rebaja: 30, id: 16},
    {nombre: "Titan Souls", img: "../../assets/img/popularesHome/Titan.png", rebaja: 0, id: 18},
    {nombre: "The Messenger", img: "../../assets/img/popularesHome/Mensajero.png", rebaja: 0, id: 19},
    {nombre: "Stardew Valley", img: "../../assets/img/popularesHome/Stardew.png", rebaja: 0, id: 12},
    {nombre: "Balatro", img: "../../assets/img/popularesHome/Balatro.png", rebaja: 0, id: 13},
    {nombre: "Inscryption", img: "../../assets/img/popularesHome/Inscyption.png", rebaja: 0, id: 14},
    {nombre: "Moonlighter", img: "../../assets/img/popularesHome/Moonlighter.png", rebaja: 0, id: 15},
  ]

  rebajasList: {nombre: string, img: string, rebaja: number, id: number}[] = [
    {nombre: "Wizard with a gun", img: "../../assets/img/popularesHome/WizardGun.png", rebaja: 30, id: 16},
    {nombre: "Sea of Stars", img: "../../assets/img/novedadesHome/SeaofStars.png", rebaja: 25, id: 8},
    {nombre: "Katana Zero", img: "../../assets/img/rebajasHome/Katana.png", rebaja: 35, id: 20},
    {nombre: "A Hat in Time", img: "../../assets/img/rebajasHome/Hat.png", rebaja: 45, id: 21}
  ]

  playerChoiceList: {nombre: string, resumen: string, etiquetas: string, img: string, puntuacionMedia: string, id:number}[] = [
    {
      nombre: "Stardew Valley",
      resumen: "Acabas de heredar la vieja parcela agrícola de tu abuelo de Stardew Valley. Decides partir hacia una nueva vida con unas herramientas usadas y algunas monedas. ¿Te ves capaz de vivir de la tierra y convertir estos campos descuidados en un hogar próspero?",
      etiquetas: "Simulador de granjas, pixel-art, 2D, casual",
      img: "../../assets/img/popularesHome/Stardew.png",
      puntuacionMedia: "4.8", 
      id: 12
    },
    {
      nombre: "Sea of Stars",
      resumen: "Sea of Stars es un RPG por turnos inspirado en los juegos de su género clásicos. Cuenta la historia de dos Niños del Solsticio que combinarán los poderes del sol y la luna para crear un Eclipse Mágico, la única fuerza capaz de parar las monstruosas creaciones de un alquimista malvado conocido como El Fleshmancer.",
      etiquetas: "Rol, aventura, por turnos, pixel-art",
      img: "../../assets/img/novedadesHome/SeaofStars.png",
      puntuacionMedia: "4.75", 
      id: 8
    },
    {
      nombre: "Celeste",
      resumen: "Ayuda a Madeline a sobrevivir a los demonios de su interior en su viaje hasta la cima de la montaña Celeste, en este ajustadísimo plataforma, obra de los creadores de TowerFall. Enfréntate a cientos de desafíos diseñados a mano, devela retorcidos secretos y, y reconstruye el misterio de la montaña.",
      etiquetas: "Plataformas, 2D, pixel-art, gran banda sonora",
      img: "../../assets/img/popularesHome/Celeste.png",
      puntuacionMedia: "4.7", 
      id: 17
    },
    {
      nombre: "Katana ZERO",
      resumen: "Katana ZERO es un juego de acción y plataformas neo-noir rebosante de personalidad, acción vertiginosa y combates de muerte instantánea. Usa tu espada, corre y manipula el tiempo para desvelar tu pasado en un despliegue acrobático brutalmente estético.",
      etiquetas: "Acción, ciberpunk, pixel-art, gran banda sonora",
      img: "../../assets/img/rebajasHome/Katana.png",
      puntuacionMedia: "4.67", 
      id: 20
    }
  ]

  lessCards: boolean = false;
  evenLessCard: boolean = false;
  mobileCards: boolean = false;

  constructor(public breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // los breakpointObserver los uso para que la página sea más responsive
    this.breakpointObserver
      .observe(['(min-width: 1025px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.lessCards = false;
        } else {
          this.lessCards = true;
        }
      });

    this.breakpointObserver
      .observe(['(min-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.evenLessCard = false;
        } else {
          this.evenLessCard = true;
          this.lessCards = false;
        }
      });

    this.breakpointObserver
      .observe(['(min-width: 431px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobileCards = false;
        } else {
          this.mobileCards = true;
          this.evenLessCard = false;
        }
      });
  }

  // Esta funcion sirve para cambiar las imagenes del carrusel dependiendo del radio button marcado
  changeImgByValue(value: number) {
    let cenIndex = value;
    let izqIndex: number;
    let derIndex: number;

    if ((value-1) < 0) {
      derIndex = this.carruselImgs.length-1;
    } else {
      derIndex = value-1;
    }

    if ((value+1) >= this.carruselImgs.length) {
      izqIndex = 0;
    } else {
      izqIndex = value+1;
    }

    for (let radio in this.radioCheck){
      this.radioCheck[radio] = false;
    }
    
    this.radioCheck[value] = true;

    this.srcImgIzq = this.carruselImgs[derIndex];
    this.idImgIzq = this.carruselImgsID[derIndex];
    this.srcImgCen = this.carruselImgs[cenIndex];
    this.idImgCen = this.carruselImgsID[cenIndex];
    this.srcImgDer = this.carruselImgs[izqIndex];
    this.idImgDer = this.carruselImgsID[izqIndex];
  }

  // Esta función pasa a la siguiente imagen del carrusel
  changeNextImg() {
    let izqIndex = this.carruselImgs.indexOf(this.srcImgIzq);
    let cenIndex = this.carruselImgs.indexOf(this.srcImgCen);
    let derIndex = this.carruselImgs.indexOf(this.srcImgDer);

    if ((izqIndex+1) >= this.carruselImgs.length) {
      izqIndex = 0;
    } else {
      izqIndex++;
    }

    if ((cenIndex+1) >= this.carruselImgs.length) {
      cenIndex = 0;
    } else {
      cenIndex++;
    }

    if ((derIndex+1) >= this.carruselImgs.length) {
      derIndex = 0;
    } else {
      derIndex++;
    }

    this.radioCheck[izqIndex] = false;
    this.radioCheck[cenIndex] = true;
    this.radioCheck[derIndex] = false;

    this.srcImgIzq = this.carruselImgs[derIndex];
    this.idImgIzq = this.carruselImgsID[derIndex];
    this.srcImgCen = this.carruselImgs[cenIndex];
    this.idImgCen = this.carruselImgsID[cenIndex];
    this.srcImgDer = this.carruselImgs[izqIndex];
    this.idImgDer = this.carruselImgsID[izqIndex];
  }

  // Esta función pasa a la anterior imagen del carrusel
  changePrevImg() {
    let izqIndex = this.carruselImgs.indexOf(this.srcImgIzq);
    let cenIndex = this.carruselImgs.indexOf(this.srcImgCen);
    let derIndex = this.carruselImgs.indexOf(this.srcImgDer);

    if ((izqIndex-1) < 0) {
      izqIndex = this.carruselImgs.length-1;
    } else {
      izqIndex--;
    }

    if ((cenIndex-1) < 0) {
      cenIndex = this.carruselImgs.length-1;
    } else {
      cenIndex--;
    }

    if ((derIndex-1) < 0) {
      derIndex = this.carruselImgs.length-1;
    } else {
      derIndex--;
    }

    this.radioCheck[izqIndex] = false;
    this.radioCheck[cenIndex] = true;
    this.radioCheck[derIndex] = false;

    this.srcImgIzq = this.carruselImgs[derIndex];
    this.idImgIzq = this.carruselImgsID[derIndex];
    this.srcImgCen = this.carruselImgs[cenIndex];
    this.idImgCen = this.carruselImgsID[cenIndex];
    this.srcImgDer = this.carruselImgs[izqIndex];
    this.idImgDer = this.carruselImgsID[izqIndex];
  }
}
