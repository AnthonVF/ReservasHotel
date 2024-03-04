'use strict'

const cliente = require("../models/hotel");
var { Cliente } = require("../models/hotel");
const habitacion = require("../models/hotel");
var { Habitacion } = require("../models/hotel");
const reserva = require("../models/hotel");
var { Reserva } = require("../models/hotel");
const contacto = require("../models/hotel");
var { Contacto } = require("../models/hotel");
const nodemailer = require('nodemailer');


//Cliente.Controller
var clienteController = {
    inicioCliente: function(req, res){
        return res.status(200).send({
            message: "<h2> Bienvenidos Clientes</h2>"
        });
    },

    saveCliente: async function(req, res){
        try{
            var cliente = new Cliente();
            var params = req.body; 
            cliente.nombre = params.nombre;
            cliente.apellido = params.apellido;
            cliente.correo = params.correo;
            cliente.contrasena = params.contrasena;
            cliente.cedula = params.cedula;
            cliente.telefono = params.telefono;
            
            var clienteStored = await cliente.save();

            if(!clienteStored){
                return res.status(400).send({message: "No se ha podido guardar el cliente"});
            }
            return res.status(201).send({cliente: clienteStored});
        } catch(error){
            return res.status(500).send({message: "Error al guardar el cliente"});
        }
    },
    getClientes:async function(req, res){
        try{
            const cliente = await Cliente.find({}).sort();
            if(cliente.length === 0){
                return res.status(404).send({message: "No hay clientes para mostrar"});
            }
            return res.status(200).send({cliente});
        } catch(error){
            return res.status(500).send({message: "Error al obtener clientes"});
        }
    },

    getCliente: async function(req, res) {
        try {
            var clienteId = req.params.id;
            var cliente = await Cliente.findById(clienteId);
            if (!cliente) {
                return res.status(404).send({ message: "No se encontró el cliente" });
            }
            return res.status(200).send({ cliente });
        } catch (error) {
            return res.status(500).send({ message: "Error al obtener el cliente" });
        }
    },      

    iniciarSesion: async function(req, res) {
        const { correo, contrasena } = req.body;
        try {
            const usuario = await Cliente.findOne({ correo });
            if (!usuario || usuario.contrasena !== contrasena) {
                return res.status(401).send({ message: "Credenciales inválidas" });
            }
            return res.status(200).send({
                _id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                contrasena: usuario.contrasena,
                cedula: usuario.cedula,
                telefono: usuario.telefono,
                __v: usuario.__v,
            });
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return res.status(500).send({ message: "Error al iniciar sesión" });
        }
    }
}

//Habitacion.Controller
var fs  = require('fs');
var path = require('path');

var habitacionController={
    getInicio:function(req, res){
        return res.status(201).send(
            "<h1>Hola 2</h1>"
        )
    },

    saveHabitacion: function(req, res) {
        var habitacion = new Habitacion();
        var params = req.body;
    
        habitacion.nombre = params.nombre;
        habitacion.descripcion = params.descripcion;
        habitacion.precio = params.precio;
        habitacion.cantidad = params.cantidad;
        habitacion.disponible = params.disponible;
        habitacion.imagen = null;
    
        habitacion.save().then(habitacionGuardada => {
            return res.status(200).send({ habitacion: habitacionGuardada });
        })
        .catch(err => {
            return res.status(500).send({ message: "Error al guardar" });
        });
    },

    getHabitaciones: function(req, res) {
        Habitacion.find({}).sort().exec().then(habitaciones => {
            return res.status(200).send({ habitaciones: habitaciones });
        })
        .catch(err => {
            return res.status(500).send({ message: "Error al recuperar los datos" });
        });
    },

    getHabitacion: function(req, res) {
        var habitacionId = req.params.id;
        if (habitacionId == null) return res.status(404).send({ message: "El ID de la habitacion no fue proporcionado" });
    
        Habitacion.findById(habitacionId).exec().then(habitacion => {
            if (!habitacion) {
                return res.status(404).send({ message: "La habitacion no existe" });
            }
            return res.status(200).send({ habitacion: habitacion });
        }).catch(err => {
            return res.status(500).send({ message: "Error al recuperar los datos de la habitacion" });
        });
    },
    
    // Método para eliminar una habitacion por su ID
    deleteHabitacion: function(req, res) {
        var habitacionId = req.params.id;

        if (!habitacionId) {
            return res.status(404).send({ message: "El ID de la habitacion no fue proporcionado" });
        }

        Habitacion.findByIdAndDelete(habitacionId)
        .exec()
        .then(deletedHabitacion => {
            if (!deletedHabitacion) {
                return res.status(404).send({ message: "La habitacion no existe" });
            }
            return res.status(200).send({ message: "Habitacion eliminada correctamente", habitacion: deletedHabitacion });
        })
        .catch(err => {
            return res.status(500).send({ message: "Error al eliminar la habitacion" });
        });
    },

    // Método para actualizar una habitacion por su ID
    updateHabitacion: function(req, res) {
        var habitacionId = req.params.id;
        var updateData = req.body;

        if (!habitacionId) {
            return res.status(404).send({ message: "El ID de la habitacion no fue proporcionado" });
        }

        Habitacion.findByIdAndUpdate(habitacionId, updateData, { new: true })
        .exec()
        .then(updatedHabitacion => {
            if (!updatedHabitacion) {
                return res.status(404).send({ message: "La habitacion no existe" });
            }
            return res.status(200).send({ message: "Habitacion actualizada correctamente", habitacion: updatedHabitacion });
        })
        .catch(err => {
            return res.status(500).send({ message: "Error al actualizar la habitacion" });
        });
    },

    uploadImage: function(req, res) {
        var habitacionId = req.params.id;
        var fileName = "Imagen no subida";
    
        if (req.files && req.files.imagen) {
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[1];
            var extSplit = fileName.split('.');
            var fileExt = extSplit[1].toLowerCase();
    
            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Habitacion.findByIdAndUpdate(habitacionId, { imagen: fileName }, { new: true }).exec()
                .then(updatedHabitacion => {
                    if (!updatedHabitacion) {
                        return res.status(404).send({ message: "La habitacion no existe y no se subió la imagen" });
                    }
                    return res.status(200).send({ message: "Imagen actualizada correctamente", habitacion: updatedHabitacion });
                })
                .catch(err => {
                    return res.status(500).send({ message: "Error al actualizar la habitacion" });
                });
            } else {
                fs.unlink(filePath, (err) => {
                    return res.status(400).send({ message: "La extensión del archivo no es válida" });
                });
            }
        } else {
            return res.status(400).send({ message: fileName });
        }
    },

    getImage:function(req, res){
        var file = req.params.imagen;
        var path_file = "./uploads/"+file;
        fs.exists(path_file,(exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({ message: "No existe la imagen"});
            }
        })
    },

    // Método para obtener el nombre de una habitación por su ID
    getNombreHabitacion: async function(req, res) {
        try {
            var habitacionId = req.params.id;
            var habitacion = await Habitacion.findById(habitacionId);
            if (!habitacion) {
                return res.status(404).send({ message: "La habitación no existe" });
            }
            return res.status(200).send({ nombre: habitacion.nombre });
        } catch (error) {
            return res.status(500).send({ message: "Error al obtener el nombre de la habitación" });
        }
    }

}

//Reserva.Controller
var reservaController = {
    inicioReserva: function(req, res){
        return res.status(200).send({
            message: "<h2> Bienvenidos Reserva</h2>"
        });
    },

    saveReserva: async function(req, res){
        try{
            var reserva = new Reserva();
            var params = req.body; 
            reserva.fechaInput = params.fechaInput;
            reserva.fechaOutput = params.fechaOutput;
            reserva.numeroAdultos = params.numeroAdultos;
            reserva.numeroNinos = params.numeroNinos;
            reserva.total = params.total;
            reserva.habitaciones = params.habitaciones;
            reserva.cliente = params.cliente;
            
            var reservaStored = await reserva.save();

            if(!reservaStored){
                return res.status(400).send({message: "No se ha podido guardar la habitacion"});
            }
            return res.status(201).send({reserva: reservaStored});
        } catch(error){
            return res.status(500).send({message: "Error al guardar la habitacion"});
        }
    },
    getReservas:async function(req, res){
        try{
            const reserva = await Reserva.find({}).sort();
            if(reserva.length === 0){
                return res.status(404).send({message: "No hay reservas para mostrar"});
            }
            return res.status(200).send({reserva});
        } catch(error){
            return res.status(500).send({message: "Error al obtener las habitaciones"});
        }
    },

    getReserva: async function(req, res) {
        try {
            var reservaId = req.params.id;
            // Mover la verificación de reservaId fuera del bloque if
            if(!reservaId) {
                return res.status(404).send({ message: "No se proporcionó un ID de reserva" });
            }
    
            // Buscar la reserva por su ID
            var reserva = await Reserva.findById(reservaId);
            
            if (!reserva) {
                return res.status(404).send({ message: "No se encontró la reserva" });
            }
    
            return res.status(200).send({ reserva });
        } catch(error) {
            return res.status(500).send({ message: "Error al obtener la reserva" });
        }
    },
    

    getReservaCliente: async function(req, res) {
        try {
            var clienteId = req.params.id; // Asegúrate de que el parámetro se llama 'id' en la ruta.
            var reservas = await Reserva.find({ cliente: clienteId }).sort('-fechaInput');
            if (!reservas || reservas.length === 0) {
                return res.status(404).send({ message: "No hay reservas para este cliente" });
            }
            return res.status(200).send({ reservas });
        } catch (error) {
            return res.status(500).send({ message: "Error al obtener las reservas del cliente", error });
        }
    },
    

    deleteReserva:async function(req, res){
        try{
            var reservaId = req.params.id;
            var reservaRemoved = await Reserva.findByIdAndDelete(reservaId);
            if(!reservaRemoved){
                return res.status(404).send({message: "No hay habitaciones para eliminar"});
            }
            return res.status(200).send({reservaRemoved});
        } catch(error){
            return res.status(500).send({message: "Error al eliminar la habitacion"});
        }
    },

    updateReserva: async function(req, res) {
        var reservaId = req.params.id;
        var updateData = req.body;

        if (!reservaId) {
            return res.status(404).send({ message: "El ID de la reserva no fue proporcionado" });
        }

        Reserva.findByIdAndUpdate(reservaId, updateData, { new: true })
        .exec()
        .then(updatedReserva => {
            if (!updatedReserva) {
                return res.status(404).send({ message: "La reserva no existe" });
            }
            return res.status(200).send({ message: "Reserva actualizada correctamente desde BackEnd", reserva: updatedReserva });
        })
        .catch(err => {
            return res.status(500).send({ message: "Error al actualizar la reservadesde BackEnd" });
        });
    }
}


var contactoController = {
    inicioContacto: function(req, res){
        return res.status(200).send({
            message: "<h2> Bienvenidos Contacto</h2>"
        });
    },

    saveContacto: async function(req, res){
        try{
            var contacto = new Contacto();
            var params = req.body; 
            contacto.nombre = params.nombre;
            contacto.telefono = params.telefono;
            contacto.correo = params.correo;
            contacto.mensaje = params.mensaje;
            
            var contactoStored = await contacto.save();

            if(!contactoStored){
                return res.status(400).send({message: "No se ha podido guardar el contacto"});
            }
            return res.status(201).send({contacto: contactoStored});
        } catch(error){
            return res.status(500).send({message: "Error al guardar el contacto"});
        }
    },

    getContactos:async function(req, res){
        try{
            const contacto = await Contacto.find({}).sort();
            if(contacto.length === 0){
                return res.status(404).send({message: "No hay contactos para mostrar"});
            }
            return res.status(200).send({contacto});
        } catch(error){
            return res.status(500).send({message: "Error al obtener contactos"});
        }
    }

}

//Correo
const enviarCorreo = async (req, res) => {
    try {
      const { correoDestino } = req.body;
  
      let transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'hotelcopodenieve1@hotmail.com',
          pass: 'hotelesf111.' // Asegúrate de proporcionar la contraseña correcta aquí
        }
      });
  
      let mailOptions = {
        from: 'tucorreo@gmail.com', // Cambia con tu correo electrónico
        to: correoDestino,
        subject: 'Asunto del correo',
        text: 'Contenido del correo'
      };
  
      let info = await transporter.sendMail(mailOptions);
  
      console.log('Correo enviado:', info.response);
      res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ error: 'Error al enviar el correo electrónico.' });
    }
  };
  




module.exports = {
    clienteController,
    habitacionController,
    reservaController,
    contactoController, 
    enviarCorreo
}