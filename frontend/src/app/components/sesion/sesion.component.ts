import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cliente, Habitacion, Reserva } from '../../models/hotel';
import { ClienteService , ReservaService, HabitacionService, enviarCorreo} from '../../services/hotel.service';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;
  public clienteActual: Cliente | null = null;
  public reservasConfirmadas: Reserva[] = [];
  public habitacionService: HabitacionService;
  mostrarMensajeCrearCuenta: boolean = false;
  public habitaciones: Habitacion[] = [];
  public adultos: number = 1; // Variable para almacenar el número de adultos
  public children: number = 0; // Variable para almacenar el número de children

  constructor(
    private clienteService: ClienteService,
    private reservaService: ReservaService,
    private _habitacionService: HabitacionService,
    //private enviarCorreo: enviarCorreo,
    private router: Router  // Agrega esta línea

  ) {
    this.habitacionService = _habitacionService; // Inicializa la propiedad habitacionService

  }

  public totalCarrito: number = 0;
  
  ngOnInit(): void {
    // Obtenemos el cliente actual desde localStorage
    const clienteActualStorage = localStorage.getItem('clienteActual');
    const clienteActual = clienteActualStorage ? JSON.parse(clienteActualStorage) : null;
    const clienteId = clienteActual ? clienteActual._id : null;
    this.adultos = parseInt(localStorage.getItem('adults') || '1');
    this.children = parseInt(localStorage.getItem('children') || '0');

    // Verificamos que tengamos un clienteId antes de continuar
    if (!clienteId) {
      console.error('No hay un cliente actual en el almacenamiento local.');
      this.mostrarMensajeCrearCuenta = true; // Establecer mostrarMensajeCrearCuenta en true
      return;
    }

    this.clienteActual = clienteActual; // Establecemos el cliente actual
    this.cargarCliente(clienteId);
    this.cargarReservasDelCliente(clienteId);
    
    if ((window as any)['paypal']) { // Verificar si paypal está definido en la ventana
      const totalReserva = parseFloat(localStorage.getItem('totalReserva') || '0');
      this.initializePayPalButton(totalReserva); // Pasar el total del carrito al inicializar el botón de PayPal
    } else {
      // Agregar el script de PayPal si aún no está cargado
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?currency=USD&client-id=AVA2QbjVbUwBFhkPODx8IoLi1VM5hWdxtj0IWgnzY7cX2_hORx-2w8RcOWiMAWHNc5RMRmcygagZDlPr';
      script.onload = () => {
        const totalReserva = parseFloat(localStorage.getItem('totalReserva') || '0');
        this.initializePayPalButton(totalReserva); // Pasar el total del carrito al inicializar el botón de PayPal
      };
      document.body.appendChild(script);
    }
}

// Método para guardar los datos de adultos y children en localStorage
guardarDatosAdicionales(): void {
  localStorage.setItem('adultos', this.adultos.toString());
  localStorage.setItem('children', this.children.toString());
}

// Método para decrementar el número de adultos
decrementAdultos(): void {
  if (this.adultos > 1) {
    this.adultos--;
    this.guardarDatosAdicionales(); // Guardar los datos después de actualizarlos
  }
}

// Método para incrementar el número de adultos
incrementAdultos(): void {
  if (this.adultos < 5) {
    this.adultos++;
    this.guardarDatosAdicionales(); // Guardar los datos después de actualizarlos
  }
}

// Método para decrementar el número de children
decrementchildren(): void {
  if (this.children > 0) {
    this.children--;
    this.guardarDatosAdicionales(); // Guardar los datos después de actualizarlos
  }
}

// Método para incrementar el número de children
incrementchildren(): void {
  if (this.children < 5) {
    this.children++;
    this.guardarDatosAdicionales(); // Guardar los datos después de actualizarlos
  }
}

eliminarReserva(reservaId: string): void {
  this.reservaService.deleteReserva(reservaId).subscribe({
    next: (res) => {
      console.log('Reserva eliminada con éxito:', res);

      // Suponiendo que tienes un array que contiene las habitaciones de la reserva que quieres actualizar.
      const habitacionesActualizadas = this.reservasConfirmadas.find(reserva => reserva._id === reservaId)?.habitaciones;

      if (habitacionesActualizadas) {
        habitacionesActualizadas.forEach(habitacionId => {
          // Encuentra la habitación en el array de habitaciones basándote en habitacionId y actualiza su cantidad
          const habitacion = this.habitaciones.find(h => h._id === habitacionId);
          if (habitacion) {
            this.habitacionService.updateHabitacion({...habitacion, cantidad: habitacion.cantidad + 1}).subscribe({
              next: (updateRes) => {
                console.log('Habitación actualizada con éxito:', updateRes);
                // Actualizar la lista de habitaciones en el estado local si es necesario
              },
              error: (err) => {
                console.error('Error al actualizar la habitación:', err);
              }
            });
          }
        });
      }

      // Actualiza la lista de reservas filtrando la que se acaba de eliminar
      this.reservasConfirmadas = this.reservasConfirmadas.filter(reserva => reserva._id !== reservaId);
    },
    error: (err) => {
      console.error('Error al eliminar la reserva:', err);
    }
  });
}


initializePayPalButton(totalReserva: number): void {
  paypal.Buttons({
    createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalReserva.toString() // Utilizar el total del carrito como el valor del pago
            }
          }
        ]
      });
    },
    onApprove: (data: any, actions: any) => {
      // Lógica cuando el usuario aprueba el pago
      return actions.order.capture().then((details: any) => {
          // Lógica para manejar la captura exitosa del pago
          console.log('Pago aprobado:', details);

          // Aquí puedes llamar al método confirmarReserva() para guardar la reserva en tu base de datos
          this.confirmarReserva();
  
          // Llama a la función updateHabitacion para reducir la cantidad de habitaciones disponibles en 1
          const carrito = this.cargarCarritoDesdeLocalStorage(); // Obtener el carrito desde localStorage
          carrito.forEach(habitacion => {
              this.habitacionService.updateHabitacion({...habitacion, cantidad: habitacion.cantidad - 1}).subscribe({
                  next: (res) => {
                      console.log('Habitación actualizada con éxito:', res);
                  },
                  error: (err) => {
                      console.error('Error al actualizar la habitación:', err);//
                  }
              });
          });
  
          // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
          alert('¡Pago exitoso! Gracias por su compra.');
      });
    },
  
    onError: (err: any) => {
      // Lógica en caso de error en el pago
      console.error('Error en el pago:', err);

      // Aquí puedes mostrar un mensaje de error al usuario o realizar otras acciones necesarias
      // por ejemplo, volver a cargar el botón de PayPal para permitir que el usuario vuelva a intentarlo
    }
  }).render('#paypal-button-container');
}


/*
// Método para enviar el correo electrónico de confirmación de reserva
enviarCorreoReservaConfirmada(): void {
  const correoDestino = (this.clienteActual as Cliente)?.correo; // Dirección de correo electrónico del cliente
  const asunto = 'Reserva de habitación en Hotel Copo de Nieve';
  const mensaje = 'Su reserva ha sido confirmada. ¡Gracias por elegirnos!'; // Mensaje de confirmación

  // Llama al servicio para enviar correos
  this.enviarCorreo.enviarCorreo({ correoDestino, asunto, mensaje }).subscribe({
    next: (response: any) => {
      console.log('Correo electrónico enviado con éxito:', response);
    },
    error: (error: any) => {
      console.error('Error al enviar el correo electrónico:', error);
    }
  });
}
*/


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
        // Iterar sobre cada reserva y obtener los nombres de las habitaciones
        this.reservasConfirmadas.forEach(reserva => {
          reserva.habitaciones.forEach((habitacionId, index) => {
            this.habitacionService.obtenerNombreHabitacion(habitacionId).subscribe(nombre => {
              reserva.habitaciones[index] = nombre; // Reemplaza el ID por el nombre
            });
          });
        });
      },
      error: (err) => {
        console.error('Error al cargar las reservas:', err);
      }
    });
  }


  confirmarReserva(): void {
    const habitaciones = this.cargarCarritoDesdeLocalStorage().map(hab => hab._id);
    const clienteId = this.clienteActual ? this.clienteActual._id : null;
    const totalReserva = parseFloat(localStorage.getItem('totalReserva') || '0'); // Cambio aquí
  
    // Verificamos que clienteId no sea null
    if (clienteId === null) {
      console.error('No hay un cliente actual seleccionado.');
      return;
    }
  
    // Recuperar las fechas de ingreso y salida almacenadas temporalmente
    const fechaIngreso = localStorage.getItem('fechaIngreso');
    const fechaSalida = localStorage.getItem('fechaSalida');
    
    // Verificar que las fechas no sean nulas
    if (!fechaIngreso || !fechaSalida) {
      console.error('Las fechas de ingreso y salida no están disponibles.');
      return;
    }
  
    // Crear la reserva con las fechas reales y los demás datos
    const nuevaReserva = new Reserva(
      null,
      new Date(fechaIngreso), // Convertir a objeto Date
      new Date(fechaSalida), // Convertir a objeto Date
      this.adultos, // Guardar el número de adultos
      this.children, // Guardar el número de children
      totalReserva,
      habitaciones,
      clienteId
    );
  
    // Guardar la reserva en la base de datos
    this.reservaService.guardarReserva(nuevaReserva).subscribe({
      next: (res) => {
        console.log('Reserva guardada con éxito:', res);
        
        // Mostrar los datos de la reserva por consola
        console.log('Datos de la reserva:', nuevaReserva);
  
        // Redirigir al usuario o mostrar un mensaje de éxito
      },
      error: (err) => {
        console.error('Error al guardar la reserva:', err);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    });
  
    this.cargarReservasDelCliente(clienteId);
  }

  // Método para confirmar la eliminación de una reserva
  confirmarEliminacion(reservaId: string): void {
    // Mostrar ventana de confirmación
    if (confirm('¿Realmente quieres eliminar esta reserva?')) {
      // Lógica para eliminar la reserva y mostrar el mensaje después
      this.eliminarReserva(reservaId);
      alert('Uno de nuestros administradores se pondrá en contacto contigo para el tema del reembolso total de la reserva.');
    }
  }

  // Método para cargar el carrito desde localStorage
  private cargarCarritoDesdeLocalStorage(): Habitacion[] {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
  }

  cerrarSesion(): void {
    // Elimina el cliente actual del almacenamiento local
    localStorage.removeItem('clienteActual');

    // Redirige al usuario a la página de inicio de sesión
    window.location.href = '/inicio';
  }

  modificarReserva(reservaId: string): void {
    console.log('Reserva seleccionada:', reservaId);
    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/modificar', reservaId]);

  }

}