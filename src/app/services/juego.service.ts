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

  getJuegosList(): Observable<Juego[]> {
    return this._http.get<Juego[]>(`${this.URL_API}/getAll`);
  }

  getJuegosListByFecha(): Observable<Juego[]> {
    return this._http.get<Juego[]>(`${this.URL_API}/getAll/OrderByFecha`)
  }

  getJuego(id: string): Observable<Juego> {
    return this._http.get<Juego>(`${this.URL_API}/getById/${id}`);
  }

  getJuegosBusqueda(): Observable<JuegoSearch[]> {
    return this._http.get<JuegoSearch[]>(`${this.URL_API}/getForSearch`);
  }

  postJuego(juego: Juego): Observable<Juego> {
    return this._http.post<Juego>(`${this.URL_API}/registrarJuego`, juego);
  }
}
