import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@angular/cdk/layout';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';


// Componentes
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TiendaComponent } from './tienda/tienda.component';
import { DetallesJuegoComponent } from './detalles-juego/detalles-juego.component';
import { PublicarJuegoComponent } from './publicar-juego/publicar-juego.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { CarritoComponent } from './carrito/carrito.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaDeseadosComponent } from './lista-deseados/lista-deseados.component';
import { ContrasenaOlvidadaComponent } from './login/contrasena-olvidada/contrasena-olvidada.component';
import { EditarDatosComponent } from './perfil/editar-datos/editar-datos.component';
import { CheckoutMobileComponent } from './carrito/checkout-mobile/checkout-mobile.component';

// Angular material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Libreria ngx-file-drop
import { NgxFileDropModule } from 'ngx-file-drop';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TiendaComponent,
    DetallesJuegoComponent,
    PublicarJuegoComponent,
    LoginComponent,
    RegistroComponent,
    CarritoComponent,
    PerfilComponent,
    ListaDeseadosComponent,
    ContrasenaOlvidadaComponent,
    EditarDatosComponent,
    CheckoutMobileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    LayoutModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatBadgeModule,
    MatCardModule,
    MatRadioModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatGridListModule,
    NgxFileDropModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTabsModule,
    MatSidenavModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(
      {"projectId":"indiecove-9b967",
      "appId":"1:139552095070:web:cf60ef08882f9349a12dcf",
      "storageBucket":"indiecove-9b967.appspot.com",
      "apiKey":"AIzaSyD2qmsK7KPrCgysusWzXEhrARZIQXPhORY",
      "authDomain":"indiecove-9b967.firebaseapp.com",
      "messagingSenderId":"139552095070"})),
    provideAuth(() => getAuth()), 
    { provide: FIREBASE_OPTIONS, useValue: {
      "projectId":"indiecove-9b967",
      "appId":"1:139552095070:web:cf60ef08882f9349a12dcf",
      "storageBucket":"indiecove-9b967.appspot.com",
      "apiKey":"AIzaSyD2qmsK7KPrCgysusWzXEhrARZIQXPhORY",
      "authDomain":"indiecove-9b967.firebaseapp.com",
      "messagingSenderId":"139552095070"
    }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
