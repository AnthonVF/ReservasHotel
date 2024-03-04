var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Esquema para Habitacion
const HabitacionSchema = Schema({
    nombre:String,
    descripcion:String,
    precio:Number,
    cantidad:Number,
    disponible:Boolean,
    imagen:String
}, { collection: 'habitacion' });

// Esquema para Cliente
var ClienteSchema = Schema({
    nombre: String,
    apellido: String,
    correo: String,
    contrasena: String,
    cedula: Number,    
    telefono: Number
}, { collection: 'cliente' });

// Esquema para Reserva
var ReservaSchema = Schema({
    fechaInput: Date,
    fechaOutput: Date,
    numeroAdultos: Number,
    numeroNinos: Number,
    total: Number,
    habitaciones: [{ type: Schema.Types.ObjectId, ref: 'Habitacion' }],
    cliente:[{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
}, { collection: 'reserva' });

// Esquema para Contacto
var ContactoSchema = Schema({
    nombre: String,
    telefono: Number,
    correo: String,
    mensaje: String
}, { collection: 'contacto' });

// Modelos
var Habitacion = mongoose.model('Habitacion', HabitacionSchema);
var Reserva = mongoose.model('Reserva', ReservaSchema);
var Cliente = mongoose.model('Cliente', ClienteSchema);
var Contacto = mongoose.model('Contacto', ContactoSchema);

// Exportar los modelos
module.exports = {
    Habitacion: Habitacion,
    Reserva: Reserva,
    Cliente: Cliente,
    Contacto: Contacto,
};
