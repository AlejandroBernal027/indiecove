import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Juego, JuegoSearch } from '../model/juego';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {

  private URL_API = 'http://172.28.0.10/games'

  constructor(private _http: HttpClient) { }

  // Obtiene de la base de datos todos los juegos
  getJuegosList(): Observable<Juego[]> {
    return this._http.get<Juego[]>(`${this.URL_API}/getAll`);
  }

  // Obtiene los juegos ordenados por fecha
  getJuegosListByFecha(): Observable<Juego[]> {
    return this._http.get<Juego[]>(`${this.URL_API}/getAll/OrderByFecha`)
  }

  // Obtiene un juego indicado por id
  getJuego(id: string): Observable<Juego> {
    return this._http.get<Juego>(`${this.URL_API}/getById/${id}`);
  }

  // Obtiene los juegos para cargarlos en el input del email
  getJuegosBusqueda(): Observable<JuegoSearch[]> {
    return this._http.get<JuegoSearch[]>(`${this.URL_API}/getForSearch`);
  }

  // Añade un juego a la base de datos
  postJuego(juego: Juego): Observable<Juego> {
    return this._http.post<Juego>(`${this.URL_API}/registrarJuego`, juego);
  }
}
