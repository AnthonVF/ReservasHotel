import { Component, OnInit } from '@angular/core';
import { Habitacion } from '../../models/hotel';
import { HabitacionService } from '../../services/hotel.service';
import { Global } from '../../services/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css']
})
export class HabitacionComponent implements OnInit{

  public habitaciones: Habitacion[];
  public url: string;
  
  constructor(
    private _habitacionService: HabitacionService,
    private router: Router // Inyectar el servicio de enrutamiento
  ){
    this.url = Global.url;
    this.habitaciones = [];
  }

  ngOnInit(): void {
    this.getHabitaciones();
  }

  getHabitaciones() {
    this._habitacionService.getHabitaciones().subscribe(
      response => {
        if(response.habitaciones) {
          this.habitaciones = response.habitaciones;
          console.log(this.habitaciones);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  agregarAlCarrito(habitacion: Habitacion) {
    this._habitacionService.agregarAlCarrito(habitacion);
    console.log('Habitación agregada al carrito:', habitacion);
    this.router.navigate(['/reserva']); // Asegúrate de que '/carrito' está definido en tus rutas
  }
  
  reservarHabitacion(): void {
    if (this.habitaciones.length > 0 && this.habitaciones[0].disponible) {
      // Realizar lógica de reserva
      console.log('Habitación reservada');
      // Aquí llamarías a tu servicio de reserva para realizar la reserva en la base de datos
    } else {
      console.log('La habitación no está disponible para reservar');
      // Aquí podrías mostrar un mensaje al usuario indicando que la habitación no está disponible
    }
  }

}