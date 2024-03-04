// En hotel.routes.js
var express = require('express');
var router = express.Router();
var controllers = require('../controllers/hotel.controllers');
// Para subir imágenes
var multiparty = require('connect-multiparty');
var multipartyMiddleWare = multiparty({ uploadDir: './uploads' });




// Rutas para Habitacion
router.post('/hotel/guardar-habitacion', controllers.habitacionController.saveHabitacion);
router.get('/hotel/habitaciones', controllers.habitacionController.getHabitaciones);
router.get('/hotel/habitacion/:id', controllers.habitacionController.getHabitacion);
router.put('/hotel/habitacion/:id', controllers.habitacionController.updateHabitacion);
router.delete('/hotel/habitacion/:id', controllers.habitacionController.deleteHabitacion);
router.post('/hotel/subir-imagen/:id', multipartyMiddleWare, controllers.habitacionController.uploadImage);
router.get('/hotel/get-imagen/:imagen', controllers.habitacionController.getImage);
router.get('/hotel/nombre-habitacion/:id', controllers.habitacionController.getNombreHabitacion);

// Rutas para Cliente
router.get('/hotel/inicio-cliente', controllers.clienteController.inicioCliente); 
router.post('/hotel/guardar-cliente', controllers.clienteController.saveCliente);
router.get('/hotel/lista-clientes', controllers.clienteController.getClientes);
router.get('/hotel/cliente/:id', controllers.clienteController.getCliente);
router.post('/hotel/iniciar-sesion', controllers.clienteController.iniciarSesion);

// Rutas para Reserva
router.get('/hotel/inicio-reservas', controllers.reservaController.inicioReserva);
router.post('/hotel/guardar-reserva', controllers.reservaController.saveReserva);
router.get('/hotel/lista-reservas', controllers.reservaController.getReservas);
router.get('/hotel/reserva/:id', controllers.reservaController.getReserva);
router.get('/hotel/reservas-cliente/:id', controllers.reservaController.getReservaCliente);
router.delete('/hotel/eliminar-reserva/:id', controllers.reservaController.deleteReserva);
router.put('/hotel/modificar-reserva/:id', controllers.reservaController.updateReserva);

// Rutas para Contacto
router.get('/hotel/inicio-contacto', controllers.contactoController.inicioContacto);
router.post('/hotel/guardar-contacto', controllers.contactoController.saveContacto);
router.get('/hotel/lista-contactos', controllers.contactoController.getContactos);

// Agregar la ruta para enviar correo electrónico
router.post('/hotel/enviar-correo', controllers.enviarCorreo);

module.exports = router;
