export interface Juego {
    idJuego: number,
    Nombre: string,
    Etiquetas: string,
    Fecha_publicacion: string,
    Nombre_Desarrollador: string,
    Precio: number,
    Rebaja: number,
    Img_principal: string,
    Img_sec1: string,
    Img_sec2: string,
    Img_sec3: string,
    Img_sec4: string,
    Sinopsis: string,
    Desarrolladores_IdDesarrolladores: number
}

export interface JuegoSearch {
    idJuego: string,
    Nombre: string,
    Img_principal: string
}