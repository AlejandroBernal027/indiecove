import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class devGuard {

  constructor( private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
      let rol = sessionStorage.getItem("Rol")

      // La página que más protegida tiene que estar es la de publicar juego, ya que solo pueden entrar los desarrolladores
      if (rol !== "desarrollador") { 
        this.router.navigate(['/home'])    
        return false;
      } else {
        if (rol) {
          if ( rol !== "desarrollador" && route.routeConfig?.path === 'publicarJuego')
            return false;
          else
              return true;
        }
        return true;
      }  
  }
}