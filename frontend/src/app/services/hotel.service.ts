import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Habitacion, Reserva, Cliente } from "../models/hotel";
import { Global } from "./global";
import { Observable, BehaviorSubject, map, catchError } from "rxjs";


//Cliente
@Injectable({
    providedIn: 'root'
})

export class ClienteService{
    public url:string;
    constructor(
        private _http:HttpClient
        
    ){
        this.url=Global.url;
    }
    
    //http://locahost:3700/cliente
    //guardar cliente
    guardarCliente(cliente:Cliente):Observable<any>{
        let params=JSON.stringify(cliente);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'guardar-cliente',params,{headers:headers});
    }
    //ver cliente
    getCliente(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'cliente/'+id,{headers:headers});
    }
    //editar cliente
    updateCliente(cliente:Cliente):Observable<any>{
        let params=JSON.stringify(cliente);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(this.url+'cliente/'+cliente._id,params,{headers:headers});
    }
    //eliminar cliente
    deleteCliente(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(this.url+'cliente/'+id,{headers:headers});
    }

    // Método para buscar un cliente por correo y contraseña
    iniciarSesion(correo: string, contrasena: string): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const body = { correo, contrasena };
        return this._http.post(this.url+'iniciar-sesion', body, { headers });
    }

    // Guardar los datos del cliente en el almacenamiento local
    guardarDatosCliente(cliente: Cliente) {
        localStorage.setItem('clienteActual', JSON.stringify(cliente));
    }

    // Obtener los datos del cliente del almacenamiento local
    obtenerDatosCliente(): Cliente | null {
        const clienteJSON = localStorage.getItem('clienteActual');
        return clienteJSON ? JSON.parse(clienteJSON) : null;
    }
}

//Reserva
@Injectable()
export class ReservaService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    //ver reserva
    //http://locahost:3700/reserva
    getReservas():Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'reservas',{headers:headers});
    }
    //guardar reserva
    guardarReserva(reserva:Reserva):Observable<any>{
        let params=JSON.stringify(reserva);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'guardar-reserva',params,{headers:headers});
    }

    getReserva(id: string): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(`${this.url}reserva/${id}`, { headers: headers });
    }
    // En reserva.service.ts
    getReservasPorCliente(clienteId: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(`${this.url}reservas-cliente/${clienteId}`, { headers: headers });
    }
    deleteReserva(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(this.url+'eliminar-reserva/'+id,{headers:headers});
    }

    // Editar reserva
    // http://localhost:3700/modificar-reserva/:id
    updateReserva(reserva: Reserva): Observable<any>{
        let params = JSON.stringify(reserva);
        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'modificar-reserva/'+reserva._id,params,{headers:headers});
    }
    
}

//Habitacion
@Injectable()
export class HabitacionService {
    public url: string;
    private totalCarrito: number = 0;

    // @ts-ignore
    private carritoSubject = new BehaviorSubject<Habitacion[]>(this.cargarCarritoDesdeLocalStorage());


    constructor(
        private _http:HttpClient
    ){
        this.url = Global.url;
        // Suscribirse a los cambios del carrito y guardarlos en localStorage
        this.carritoSubject.subscribe(
            carrito => {
              localStorage.setItem('carrito', JSON.stringify(carrito));
            },
            error => {
              console.error('Error al guardar el carrito en localStorage', error);
            }
        );
    }
    // Ver todas las habitaciones
    // http://localhost:3700/habitaciones
    getHabitaciones():Observable<any>{
        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'habitaciones',{headers:headers});
    }

    // Guardar habitacion
    // http://localhost:3700/guardar-habitacion
    guardarHabitacion(habitacion: Habitacion): Observable<any>{
        let params = JSON.stringify(habitacion);

        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+'guardar-habitacion', params, {headers:headers});
    }

    // Ver habitacion
    // http://localhost:3700/habitacion/:id
    getHabitacion(id: string): Observable<any>{
        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'habitacion/'+id,{headers:headers});
    }

    // Editar habitacion
    // http://localhost:3700/habitacion/:id
    updateHabitacion(habitacion: Habitacion): Observable<any>{
        let params = JSON.stringify(habitacion);

        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'habitacion/'+habitacion._id,params,{headers:headers});
    }
    
    // Eliminar habitacion
    // http://localhost:3700/habitacion/:id
    deleteHabitacion(id: string): Observable<any>{
        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url+'habitacion/'+id,{headers:headers});
    }

    // Métodos del carrito
    agregarAlCarrito(habitacion: Habitacion): void {
        const carritoActual = this.carritoSubject.getValue();
        // Verifica si la habitación ya está en el carrito para evitar duplicados
        const yaEstaEnCarrito = carritoActual.find(hab => hab._id === habitacion._id);
        if (!yaEstaEnCarrito) {
          this.carritoSubject.next([...carritoActual, habitacion]);
        }
    }

    //Metodo para mostrar nombre de habitacion en base a su id
    obtenerNombreHabitacion(id: string): Observable<string> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get<{ nombre: string }>(this.url + 'nombre-habitacion/' + id, {headers: headers})
          .pipe(map(response => response.nombre)); // Devuelve directamente el nombre
    }

    eliminarDelCarrito(id: string): void {
        const carritoActual = this.carritoSubject.getValue();
        const carritoActualizado = carritoActual.filter(hab => hab._id !== id);
        this.carritoSubject.next(carritoActualizado);
    }

    vaciarCarrito(): void {
        this.carritoSubject.next([]);
    }

    obtenerCarrito(): Habitacion[] {
        const carrito = this.carritoSubject.getValue();
        console.log('Total de habitaciones en el carrito:', carrito.length); // Muestra por consola el total de habitaciones en el carrito
        console.log('Habitaciones en el carrito:', carrito); // Muestra por consola las habitaciones en el carrito
        return carrito;
    }       

    obtenerTotalCarritoDesdeLocalStorage(): number {
        const carritoJSON = localStorage.getItem('carrito');
        if (carritoJSON) {
            const carrito = JSON.parse(carritoJSON);
            this.totalCarrito = carrito.reduce((total: number, hab: Habitacion) => total + hab.precio, 0);
        } else {
            this.totalCarrito = 0; // Si no hay elementos en el carrito, el total es cero
        }
        return this.totalCarrito;
    }
    

    // Método para cargar el carrito desde localStorage
    private cargarCarritoDesdeLocalStorage(): Habitacion[] {
        const carritoJSON = localStorage.getItem('carrito');
        return carritoJSON ? JSON.parse(carritoJSON) : [];
    }
    
}


//Contacto
@Injectable()
export class ContactoService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    //guardar contacto
    guardarContacto(contacto:any):Observable<any>{
        let params=JSON.stringify(contacto);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'guardar-contacto',params,{headers:headers});
    }
}

//Correo 
@Injectable()
export class enviarCorreo{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    //enviar correo
    enviarCorreo(correo:any):Observable<any>{
        let params=JSON.stringify(correo);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'enviar-correo',params,{headers:headers});
    }
}

