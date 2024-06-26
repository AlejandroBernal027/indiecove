import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListaDeseados } from '../model/lista-deseados';

@Injectable({
  providedIn: 'root'
})
export class ListaDeseadosService {

  private URL_API = 'http://172.28.0.10/lista'

  constructor(private _http: HttpClient) { }

  // Crea una lista de deseados
  makeListaDeseados(lista: ListaDeseados): Observable<ListaDeseados> {
    return this._http.post<ListaDeseados>(`${this.URL_API}/createLista`, lista);
  }

  // Obtiene la lista de deseados de un usuario
  getListaDeseados(id: number): Observable<ListaDeseados> {
    return this._http.get<ListaDeseados>(`${this.URL_API}/getById/${id}`);
  }

  // Añade un juego a la lista de deseados de un usuario
  addJuego(idListaDeseados: number, idJuego: number): Observable<{idListaDeseados: number, idJuego: number}> {
    return this._http.post<{idListaDeseados: number, idJuego: number}>(`${this.URL_API}/addGameToWishList`, {idListaDeseados, idJuego})
  }
}
