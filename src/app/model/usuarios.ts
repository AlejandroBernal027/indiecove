export interface Jugador {
    idJugadores: number,
    Email: string,
    Nombre: string,
    Apellidos: string,
    Nombre_usuario: string,
    Contrasena: string,
    Foto_perfil: string | null
}

export interface Desarrollador {
    idDesarrolladores: number,
    Email: string,
    Nombre: string,
    Apellidos: string,
    Nombre_usuario: string,
    Contrasena: string,
    Nombre_Editor: string,
    Foto_perfil: string | null
}

export interface Administrador {
    idAdministradores: number,
    Email: string,
    Nombre: string,
    Apellidos: string,
    Nombre_usuario: string,
    Contrasena: string,
    Foto_perfil: string | null
}