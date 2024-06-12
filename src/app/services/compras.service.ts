import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compras } from '../model/compras';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private URL_API = 'http://172.28.0.10/compras'

  constructor(private _http: HttpClient) { }

  // Registra una compra
  registrarCompra(compra: Compras): Observable<Compras> {
    return this._http.post<Compras>(`${this.URL_API}/registrarCompra`, compra);
  }

  // Introduce un juego en la biblioteca de un jugador
  postJugadorHasJuego(idjugador: number, idjuego: number): Observable<{idJugador: number, idJuego: number}> {
    return this._http.post<{idJugador: number, idJuego: number}>(`${this.URL_API}/makeJugadorHasJuego`, {idJugador: idjugador, idJuego: idjuego})
  }
}
