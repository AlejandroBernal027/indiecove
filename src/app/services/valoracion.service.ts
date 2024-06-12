import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Valoracion } from '../model/valoracion';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {

  private URL_API = 'http://172.28.0.10/valoraciones'

  constructor(private _http: HttpClient) { }

  // Obtiene las valoraciones de un juego
  getValoracionesListByGameId(id: number): Observable<Valoracion[]> {
    return this._http.get<Valoracion[]>(`${this.URL_API}/getByGameId/${id}`);
  }

  // Añade una valoración
  addValoracion(valoracion: Valoracion): Observable<Valoracion>{
    console.log(valoracion);
    return this._http.post<Valoracion>(`${this.URL_API}/registrarValoracion`, valoracion);
  }
}
