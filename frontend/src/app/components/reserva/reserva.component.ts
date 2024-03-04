import { Component, OnInit } from '@angular/core';
import { HabitacionService } from '../../services/hotel.service';
import { Habitacion } from '../../models/hotel';
import { Global } from '../../services/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  habitacionesEnCarrito: Habitacion[] = [];
  total: number = 0;
  fechaIngreso: string = '';
  fechaSalida: string = '';
  diasEstadia: number = 0;
  public habitaciones: Habitacion[];
  public url: string;
  urlBackend: string = 'http://localhost:3700/';

  constructor(
    private habitacionService: HabitacionService,
    private router: Router // Inyectar el servicio de enrutamiento
  ){
    this.url = Global.url;
    this.habitaciones = [];
  }

  ngOnInit() {
    this.habitacionesEnCarrito = this.habitacionService.obtenerCarrito();
    this.calcularTotal();
  }

  calcularTotal() {
    const fechaIngreso = localStorage.getItem('fechaIngreso');
    const fechaSalida = localStorage.getItem('fechaSalida');
    
    if (!fechaIngreso || !fechaSalida) {
      console.error('Las fechas de ingreso y salida no están disponibles.');
      return;
    }

    const fechaIngresoObj = new Date(fechaIngreso);
    const fechaSalidaObj = new Date(fechaSalida);
    const diasEstadia = this.calcularDiasEstadia(fechaIngresoObj, fechaSalidaObj);this.diasEstadia = diasEstadia;

    console.log('Fecha de ingreso:', fechaIngresoObj);
    console.log('Fecha de salida:', fechaSalidaObj);
    console.log('Número de días de estancia:', diasEstadia);
    
    this.total = this.habitacionesEnCarrito.reduce((acc, habitacion) => acc + habitacion.precio, 0) * diasEstadia;
    // Dentro de ReservaComponent, después de calcular el total
    localStorage.setItem('totalReserva', this.total.toString());
    console.log('Total:', this.total);
  }

  calcularDiasEstadia(fechaIngreso: Date, fechaSalida: Date): number {
    const unDia = 24 * 60 * 60 * 1000;
    const diffDias = Math.round(Math.abs((fechaSalida.getTime() - fechaIngreso.getTime()) / unDia));
    return diffDias;
  }

  eliminarDelCarrito(id: string) {
    this.habitacionService.eliminarDelCarrito(id);
    this.habitacionesEnCarrito = this.habitacionService.obtenerCarrito();
    this.calcularTotal();
  }
}