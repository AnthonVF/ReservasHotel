import { Component } from '@angular/core';
import { Cliente } from '../../models/hotel';
import { ClienteService } from '../../services/hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-usu',
  templateUrl: './crear-usu.component.html',
  styleUrls: ['./crear-usu.component.css'],
  providers: [ClienteService]
})
export class CrearUsuComponent {
  cliente: Cliente = new Cliente('', '', '', '', '', '', ''); // Incluye el campo para la contraseña
  status: string = '';

  constructor(private clienteService: ClienteService,
    private router: Router // Importar el servicio Router
    ) {}

  registrarCliente() {
    this.clienteService.guardarCliente(this.cliente).subscribe(
      response => {
        console.log('Cliente registrado exitosamente:', response);
        this.status = 'success';
        // Limpiar el formulario después de guardar
        this.cliente = new Cliente('', '', '', '', '', '', ''); // Reinicia el cliente
      },
      error => {
        console.error('Error al registrar cliente:', error);
        this.status = 'failed';
      }
    );
  }

  regresar(): void {
    // Navegar hacia atrás
    this.router.navigate(['/login']);
  }
}
