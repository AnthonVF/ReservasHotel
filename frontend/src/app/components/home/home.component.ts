import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fechaIngreso: string = '';
  fechaSalida: string = '';
  fechaIngresoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  fechaSalidaSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  adults: number = 1;
  children: number = 0;


  constructor(private router: Router) {}

  ngOnInit(): void {
    const fechaIngreso = document.getElementById('fechaIngreso') as HTMLInputElement;
    const fechaSalida = document.getElementById('fechaSalida') as HTMLInputElement;
    const botonBuscar = document.getElementById('botonBuscar') as HTMLButtonElement;

    const hoy = new Date();
    const fechaMinima = hoy.toISOString().split('T')[0];
    fechaIngreso.setAttribute('min', fechaMinima);
    fechaSalida.setAttribute('min', fechaMinima);

    function actualizarYValidarFechas() {
      fechaSalida.setAttribute('min', fechaIngreso.value);
      botonBuscar.disabled = !(fechaIngreso.value && fechaSalida.value && new Date(fechaIngreso.value) <= new Date(fechaSalida.value));
    }

    fechaIngreso.addEventListener('change', actualizarYValidarFechas);
    fechaSalida.addEventListener('change', actualizarYValidarFechas);
  }
  
  decrementAdultos(): void {
    if (this.adults > 1) {
      this.adults--;
    }
  }

  incrementAdultos(): void {
    if (this.adults < 5) {
      this.adults++;
    }
  }

  decrementNinos(): void {
    if (this.children > 0) {
      this.children--;
    }
  }

  incrementNinos(): void {
    if (this.children < 5) {
      this.children++;
    }
  }

  fechasValidas(): boolean {
    const fechaIngresoDate = new Date(this.fechaIngreso);
    const fechaSalidaDate = new Date(this.fechaSalida);

    if (isNaN(fechaIngresoDate.getTime()) || isNaN(fechaSalidaDate.getTime())) {
      return false;
    }

    return fechaSalidaDate > fechaIngresoDate;
  }

  buscarHabitaciones(): void {
    if (this.fechasValidas()) {
      console.log('Buscar habitaciones con las fechas:', this.fechaIngreso, this.fechaSalida);

      // Actualizar las fechas en BehaviorSubject
      this.fechaIngresoSubject.next(this.fechaIngreso);
      this.fechaSalidaSubject.next(this.fechaSalida);

      // Guardar en localStorage
      localStorage.setItem('fechaIngreso', this.fechaIngreso);
      localStorage.setItem('fechaSalida', this.fechaSalida);

      // Guardar adultos y niños en localStorage
      localStorage.setItem('adults', this.adults.toString());
      localStorage.setItem('children', this.children.toString());

      // Imprimir en consola
      console.log('Fecha de ingreso:', this.fechaIngreso);
      console.log('Fecha de salida:', this.fechaSalida);
      console.log('Adultos:', this.adults);
      console.log('Niños:', this.children);

      // Aquí puedes implementar la lógica para buscar habitaciones con las fechas y datos de adultos y niños ingresados

      // Redirige a la ruta /habitacion
      this.router.navigate(['/habitacion']);
    } else {
      console.log('Las fechas ingresadas no son válidas.');
    }
  }
}