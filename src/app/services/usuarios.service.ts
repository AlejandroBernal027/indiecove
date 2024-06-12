import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Administrador, Desarrollador, Jugador } from '../model/usuarios';
import { Observable } from 'rxjs';
import { Juego } from '../model/juego';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private URL_API = 'http://172.28.0.10/user'
  
  constructor(private _http: HttpClient) { }

  // Los login, hacen login de los usuarios
  loginUser(email: string): Observable<Jugador> {
    return this._http.get<Jugador>(`${this.URL_API}/loginJugador/${email}`);
  }

  loginDev(email: string): Observable<Desarrollador> {
    return this._http.get<Desarrollador>(`${this.URL_API}/loginDesarrollador/${email}`);
  }

  loginAdmin(email: string): Observable<Administrador> {
    return this._http.get<Administrador>(`${this.URL_API}/loginAdministrador/${email}`);
  }

  // Los get obtienen los datos de un usuario
  getUser(id: string): Observable<Jugador> {
    return this._http.get<Jugador>(`${this.URL_API}/jugador/${id}`);
  }

  getDev(id: string): Observable<Desarrollador> {
    return this._http.get<Desarrollador>(`${this.URL_API}/desarrollador/${id}`);
  }

  getAdmin(id: string): Observable<Administrador> {
    return this._http.get<Administrador>(`${this.URL_API}/administrador/${id}`);
  }

  // Los add añaden un usuario a la base de datos
  addUser(jugador: Jugador): Observable<Jugador> {
    return this._http.post<Jugador>(`${this.URL_API}/registrarJugador`, jugador);
  }

  addDev(desarrollador: Desarrollador): Observable<Desarrollador> {
    return this._http.post<Desarrollador>(`${this.URL_API}/registrarDesarrollador`, desarrollador);
  }

  addAdmin(administrador: Administrador): Observable<Administrador> {
    return this._http.post<Administrador>(`${this.URL_API}/registrarAdministrador`, administrador);
  }

  // Obtiene los juegos comprados por el usuario
  getJuegosCompradosPor(id: number): Observable<Juego[]> {
    return this._http.get<Juego[]>(`${this.URL_API}/getGamesOwnedBy/${id}`);
  }

  // Obtiene los juegos hechos por el desarrollador
  getJuegosHechosPor(id: number): Observable<Juego[]> {
    return this._http.get<Juego[]>(`${this.URL_API}/getGamesMadeBy/${id}`)
  }

  // Los update actualizan los datos de los usuarios
  updateDatosUser(usuario: Jugador): Observable<Jugador> {
    return this._http.put<Jugador>(`${this.URL_API}/modificarJugador`, usuario)
  }

  updateDatosDev(usuario: Desarrollador): Observable<Desarrollador> {
    return this._http.put<Desarrollador>(`${this.URL_API}/modificarDesarrollador`, usuario)
  }

  updateDatosAdmin(usuario: Administrador): Observable<Administrador> {
    return this._http.put<Administrador>(`${this.URL_API}/modificarAdministrador`, usuario)
  }

  // Los getAll, obtienen todos los jugadores y los desarrolladores
  getAllUsers(): Observable<Jugador[]> {
    return this._http.get<Jugador[]>(`${this.URL_API}/jugadores`);
  }

  getAllDevs(): Observable<Desarrollador[]> {
    return this._http.get<Desarrollador[]>(`${this.URL_API}/desarrolladores`);
  }

  // Obtiene los juegos de la lista de deseados del usuario
  getJuegosDeListaDeseados(id: number): Observable<Juego[]> {
    return this._http.get<Juego[]>(`${this.URL_API}/getGamesWishListedBy/${id}`);
  }
}
