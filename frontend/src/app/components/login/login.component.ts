import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../models/hotel';
import { ClienteService } from '../../services/hotel.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Componente para el inicio de sesión
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ClienteService]
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  error: string = '';
  isLoading: boolean = false; // Controlador de estado de carga

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  iniciarSesion(): void {
    if (this.correo && this.contrasena) {
      this.isLoading = true;
      this.clienteService.iniciarSesion(this.correo, this.contrasena)
        .pipe(
          catchError((error) => {
            this.error = error.status === 401
              ? 'Credenciales inválidas. Por favor, intenta de nuevo.'
              : 'Problema al conectarse al servidor. Por favor, intenta más tarde.';
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe(
          (response) => {
            if (response) {
              console.log('Respuesta del servidor:', response); // Agregar mensaje de consola para verificar la respuesta del servidor
              if (response && response._id) {
                console.log('Datos del cliente obtenidos:', response); // Agregar mensaje de consola para verificar los datos del cliente
                localStorage.setItem('clienteActual', JSON.stringify(response));
                this.router.navigate(['/sesion']);
              } else {
                console.error('Error: No se recibieron datos del cliente.');
              }
            }
            this.isLoading = false;
          },
          (error) => {
            // El manejo de errores ya se realiza en el catchError
          }
        );
    } else {
      this.error = 'Por favor, ingresa tu correo electrónico y contraseña.';
    }
  }
}
