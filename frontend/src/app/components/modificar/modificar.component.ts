import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../services/hotel.service';
import { Reserva } from '../../models/hotel';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent implements OnInit {
  reservaId: string | null = null;
  reserva: Reserva | null = null;
  nuevoNumeroAdultos: number | null = null;
  nuevoNumeroNinos: number | null = null;
  nuevaFechaInput: string | null = null;
  nuevaFechaOutput: string | null = null;
  minDate: string | undefined; // Variable para almacenar la fecha mínima

  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private router: Router // Importar el servicio Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.reservaId = params.get('id');
      if (this.reservaId) {
        this.obtenerReserva(this.reservaId);
      }
    });

    // Establecer la fecha mínima como el día actual
    this.minDate = this.formatDate(new Date());
  }

  obtenerReserva(reservaId: string): void {
    this.reservaService.getReserva(reservaId).subscribe(
      (response) => {
        this.reserva = response.reserva;
        if (this.reserva) {
          this.nuevoNumeroAdultos = this.reserva.numeroAdultos;
          this.nuevoNumeroNinos = this.reserva.numeroNinos;
          this.nuevaFechaInput = this.reserva.fechaInput ? this.formatDate(this.reserva.fechaInput) : null;
          this.nuevaFechaOutput = this.reserva.fechaOutput ? this.formatDate(this.reserva.fechaOutput) : null;
        }
      },
      (error) => {
        console.error('Error al obtener la reserva:', error);
      }
    );
  }

  guardarCambios(): void {
    if (this.reserva) {
      // Verificar qué campos han sido modificados
      const cambios: any = {};
      if (this.nuevoNumeroAdultos !== null && this.nuevoNumeroAdultos !== this.reserva.numeroAdultos) {
        cambios.numeroAdultos = this.nuevoNumeroAdultos;
      }
      if (this.nuevoNumeroNinos !== null && this.nuevoNumeroNinos !== this.reserva.numeroNinos) {
        cambios.numeroNinos = this.nuevoNumeroNinos;
      }
      if (this.nuevaFechaInput && this.nuevaFechaOutput) {
        // Convertir las cadenas de fecha en objetos de fecha
        const fechaEntrada = new Date(this.nuevaFechaInput);
        const fechaSalida = new Date(this.nuevaFechaOutput);
        // Verificar si la fecha de salida es posterior o igual a la fecha de entrada
        if (fechaSalida.getTime() >= fechaEntrada.getTime()) {
          // Formatear las fechas en formato ISO
          cambios.fechaInput = fechaEntrada.toISOString();
          cambios.fechaOutput = fechaSalida.toISOString();
        } else {
          console.error('La fecha de salida no puede ser anterior a la fecha de entrada.');
          return; // Salir de la función si la fecha de salida es anterior a la fecha de entrada
        }
      }
  
      if (Object.keys(cambios).length > 0) {
        // Si hay cambios, actualizar la reserva
        this.reservaService.updateReserva({ ...this.reserva, ...cambios }).subscribe(
          (response) => {
            console.log('Reserva actualizada con éxito:', response);
            alert('Cambios realizados con éxito'); // Mostrar mensaje de éxito
          },
          (error) => {
            console.error('Error al actualizar la reserva:', error);
          }
        );
      } else {
        console.log('No se han realizado cambios.');
      }
    } else {
      console.error('No se puede guardar cambios, reserva no encontrada.');
    }
  }
  
  


  regresar(): void {
    // Navegar hacia atrás
    this.router.navigate(['/sesion']);
  }

  formatDate(date: Date | string | null): string {
    if (date instanceof Date) {
      // Ajustar la fecha sumando el offset de la zona horaria
      const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      return adjustedDate.toISOString().split('T')[0];
    } else {
      return ''; // Retorna una cadena vacía si el argumento no es una instancia de Date
    }
  }
  
}
