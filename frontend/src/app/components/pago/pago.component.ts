import { Component, OnInit } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http'; // Importa el módulo HttpClient
import { Cliente, Habitacion, Reserva } from '../../models/hotel';
import { ClienteService , ReservaService } from '../../services/hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  public clienteActual: Cliente | null = null;
  public reservasConfirmadas: Reserva[] = [];
  public pagoExitoso: boolean = false;
  
  constructor(
    private clienteService: ClienteService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clienteId = '65da90ab13d7722024393b94'; // ID quemado
    this.cargarCliente(clienteId);
    this.cargarCliente(clienteId);
    this.cargarReservasDelCliente(clienteId);
  }

  cargarCliente(clienteId: string) {
    this.clienteService.getCliente(clienteId).subscribe(
      response => {
        this.clienteActual = response.cliente;
      },
      error => {
        console.error('Error al cargar el cliente:', error);
      }
    );
  }

  cargarReservasDelCliente(clienteId: string) {
    this.reservaService.getReservasPorCliente(clienteId).subscribe({
      next: (res) => {
        this.reservasConfirmadas = res.reservas;
      },
      error: (err) => {
        console.error('Error al cargar las reservas:', err);
      }
    });
  }

  realizarPago(): void {
    // Aquí iría la lógica para realizar el pago con PayPal u otro proveedor de pagos
    // Simulamos un pago exitoso
    this.pagoExitoso = true;
  }

  confirmarPago(): void {
    if (!this.pagoExitoso) {
      console.error('Debe realizar el pago antes de confirmar la reserva.');
      return;
    }

    // Aquí podrías realizar acciones adicionales después de que el pago se haya realizado con éxito
    console.log('El pago se ha realizado con éxito.');

    // Luego, podrías redirigir al usuario a la página de confirmación o realizar otras acciones necesarias.
  }

  // Método para cargar el carrito desde localStorage
  private cargarCarritoDesdeLocalStorage(): Habitacion[] {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
  }
}
