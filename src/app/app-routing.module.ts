import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TiendaComponent } from './tienda/tienda.component';
import { DetallesJuegoComponent } from './detalles-juego/detalles-juego.component';
import { PublicarJuegoComponent } from './publicar-juego/publicar-juego.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { CarritoComponent } from './carrito/carrito.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaDeseadosComponent } from './lista-deseados/lista-deseados.component';
import { devGuard } from './guard/dev.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'detallesJuego/:id', component: DetallesJuegoComponent },
  { path: 'publicarJuego', component: PublicarJuegoComponent, canActivate: [devGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'carrito', component: CarritoComponent},
  { path: 'perfil', component: PerfilComponent },
  { path: 'listaDeseados', component:ListaDeseadosComponent },
  { path: '', redirectTo:'home', pathMatch:'full' },
  { path: '**', redirectTo:'home', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
