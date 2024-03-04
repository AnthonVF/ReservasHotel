import { Component } from '@angular/core';
import { ContactoService } from '../../services/hotel.service';
import { Contacto } from 'src/app/models/hotel';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  providers: [ContactoService]
})
export class ContactoComponent {
  status: string = '';
  contacto: Contacto = {
    nombre: '',
    telefono: '',
    correo: '',
    mensaje: '',
    _id: ''
  };

  constructor(private contactoService: ContactoService) {}

  enviarConsulta(): void {
    this.contactoService.guardarContacto(this.contacto).subscribe(
      (response) => {
        console.log('Datos guardados con éxito:', response);
        this.status = 'success';
        // Limpiar el formulario después de enviar
        this.contacto = {
          _id: '', // Add the _id property
          nombre: '',
          telefono: '',
          correo: '',
          mensaje: ''
        };
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
        this.status = 'failed';
      }
    );
  }
}
