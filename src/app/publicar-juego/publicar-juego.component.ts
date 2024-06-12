import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Juego } from '../model/juego';
import { MatButton } from '@angular/material/button';
import { MatRadioButton } from '@angular/material/radio';
import { UsuariosService } from '../services/usuarios.service';
import { Desarrollador } from '../model/usuarios';
import { JuegoService } from '../services/juego.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicar-juego',
  templateUrl: './publicar-juego.component.html',
  styleUrl: './publicar-juego.component.css'
})
export class PublicarJuegoComponent {

  public base64Image1: any = null;
  public base64Image2: any = null;
  public base64Image3: any = null;
  public base64Image4: any = null;
  public base64Image5: any = null;
  public JuegoForm!: FormGroup;
  public idDev!: string | null;
  public files: NgxFileDropEntry[] = [];

  Etiquetas = new FormControl('');
  EtiquetasList: string[] = ['3D', 'Plataformas', 'Pixel-Art', 'Ambientales', 'LGBTQ+', 'Gran Banda Sonora', 'Shooter', 'Acción', 'RogueLite', '2D', '2.5D', 'Ritmo', 'Sobrenatural'];

  // Este placeholder sirve para informar a los desarrolladores de como se introduce la sinopsis
  placeholderDescripcion = `Sinopsis\\
Descripción adicional 1·
Descripción adicional 2·

(Para separa el texto de la sinopsis del de la descripción adicional se usa "\\".)
(Para hacer lineas nuevas en la descripción adicional se usa "·".)`

  @ViewChild('textarea') sinopsis!: ElementRef<HTMLTextAreaElement>

  @ViewChild('button1') boton1!: MatRadioButton;
  @ViewChild('button2') boton2!: MatRadioButton;
  @ViewChild('button3') boton3!: MatRadioButton;
  @ViewChild('button4') boton4!: MatRadioButton;
  @ViewChild('button5') boton5!: MatRadioButton;

  constructor(private _fb: FormBuilder,
              private _userService: UsuariosService,
              private _juegoService: JuegoService,
              private _router: Router,
              private _snackBar: MatSnackBar
  ) {
    this.JuegoForm = this._fb.group({
      nombreJuego: ['', [Validators.required]],
      precio: ['', [Validators.required]]
    })
  }
 
  // Esta función carga las imagenes para previsualizarlas
  public dropped(files: NgxFileDropEntry[], number: any) {
    this.files = files;

    if (files.length > 1){
      alert("No se puede introducir más de una archivo a la vez");
    } else {
      const droppedFile = files[0];
   
        // Is it a file?
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            console.log(file.type);
            if (file.type == "image/png" || file.type == "image/jpeg"){
              const reader = new FileReader();
                reader.onload = (e) => {
                  switch(number){
                    case 1:
                      this.base64Image1 = reader.result;
                      console.log(this.base64Image1)
                      break;
                    case 2:
                      this.base64Image2 = reader.result;
                      console.log(this.base64Image2)
                      break;
                    case 3:
                      this.base64Image3 = reader.result;
                      console.log(this.base64Image3)
                      break;
                    case 4:
                      this.base64Image4 = reader.result;
                      console.log(this.base64Image4)
                      break;
                    case 5:
                      this.base64Image5 = reader.result;
                      console.log(this.base64Image5)
                      break;
                  }
                  
                };
              reader.readAsDataURL(file as Blob);
              console.log(droppedFile.relativePath, file);
            } else {
              alert("Solo se aceptan imágenes en formato .png o .jpg")
            }
          });
        } else {
          const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
          console.log(droppedFile.relativePath, fileEntry);
        }
    }
    
    
  }
 
  public fileOver(event: any){
    console.log(event);
  }
 
  public fileLeave(event: any){
    console.log(event);
  }

  public deleteImage(number: any){
    switch(number){
      case 1:
        this.base64Image1 = "";
        break;
      case 2:
        this.base64Image2 = "";
        break;
      case 3:
        this.base64Image3 = "";
        break;
      case 4:
        this.base64Image4 = "";
        break;
      case 5:
        this.base64Image5 = "";
        break;
    }
  }

  // Esta función hace la llamada a la API para introducir un nuevo juego en la base de datos
  public publicarJuego() {
    if (this.JuegoForm.valid) {
      let verificado = sessionStorage.getItem("Verificado");
      if (verificado == "true") {

        this.idDev = sessionStorage.getItem("Id Usuario");
        if (this.idDev !== null) {
            this._userService.getDev(this.idDev).subscribe({
              next: (data: any) => {
                let mainImg;
                let otherImgs: any[] = [];
                let arrayValor: any = this.Etiquetas.value;
                let fecha = new Date;
                let anio = fecha.getFullYear();
                let mes;
                let dia;
                if (fecha.getMonth() < 10) {
                  mes = `0${fecha.getMonth()}`;
                } else {
                  mes = fecha.getMonth();
                }
                if ( fecha.getDate() < 10) {
                  dia = `0${fecha.getDate()}`;
                } else {
                  dia = fecha.getDate();
                }
                let fechaPublicacion = `${anio}-${mes}-${dia}`;
                
                if (this.boton1.checked == true) {
                  mainImg = this.base64Image1;
                  otherImgs = [this.base64Image2, this.base64Image3, this.base64Image4, this.base64Image5];
                } else if (this.boton2.checked == true) {
                  mainImg = this.base64Image2;
                  otherImgs = [this.base64Image1, this.base64Image3, this.base64Image4, this.base64Image5];
                } else if (this.boton3.checked == true) {
                  mainImg = this.base64Image3;
                  otherImgs = [this.base64Image1, this.base64Image2, this.base64Image4, this.base64Image5];
                } else if (this.boton4.checked == true) {
                  mainImg = this.base64Image4;
                  otherImgs = [this.base64Image1, this.base64Image2, this.base64Image3, this.base64Image5];
                } else if (this.boton5.checked == true) {
                  mainImg = this.base64Image5;
                  otherImgs = [this.base64Image1, this.base64Image2, this.base64Image3, this.base64Image4];
                }
                if (this.idDev !== null) {
                  let juego: Juego = {
                    idJuego: 0,
                    Nombre: this.JuegoForm.value.nombreJuego,
                    Etiquetas: arrayValor.join(", "),
                    Fecha_publicacion: fechaPublicacion,
                    Nombre_Desarrollador: data[0].Nombre_usuario,
                    Precio: this.JuegoForm.value.precio,
                    Rebaja: 0,
                    Img_principal: mainImg,
                    Img_sec1: otherImgs[0],
                    Img_sec2: otherImgs[1],
                    Img_sec3: otherImgs[2],
                    Img_sec4: otherImgs[3],
                    Sinopsis: this.sinopsis.nativeElement.value,
                    Desarrolladores_IdDesarrolladores: parseInt(this.idDev)
                  }
                  this._juegoService.postJuego(juego).subscribe({
                    next: async (data: Juego) => {
                      this.openSnackBarSuccess();
                      await this._router.navigateByUrl("home").then(() => {
                        window.location.reload();
                      })
                    },
                    error: (err: any) => {
                      this.openSnackBarFailed();
                    }
                  });
                }
              }
          });
        } else {
          this.openSnackBarNoVerificado();
        }
      }
    }
  }

  openSnackBarSuccess() {
    this._snackBar.open('Juego publicado con éxito', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  openSnackBarFailed() {
    this._snackBar.open('No se ha podido publicar el juego', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }

  openSnackBarNoVerificado() {
    this._snackBar.open('Necesitas verificar tu cuenta para realizar esta acción', '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    )
  }
}
