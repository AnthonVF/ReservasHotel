export class Cliente{
    constructor(
        public _id:string,
        public nombre:string,
        public apellido:string,
        public correo:string,
        public contrasena:string,
        public cedula:string,
        public telefono:string,
    ){}   
}

export class Habitacion {
    constructor(
        public _id: string,
        public nombre: string,
        public descripcion: string,
        public precio: number,
        public cantidad: number,
        public disponible: boolean,
        public imagen: string
    ) { }
}

export class Reserva{
    constructor(
        public _id:string | null,
        public fechaInput: Date | null,
        public fechaOutput: Date | null,
        public numeroAdultos: number | null,
        public numeroNinos: number | null,
        public total: number | null,
        public habitaciones: string[],
        public cliente: string | null
    ){}   
}

export class Contacto{
    constructor(
        public _id:string,
        public nombre:string,
        public telefono:string,
        public correo:string,
        public mensaje:string,
    ){}
}
    
