var mongoose = require('mongoose');
var port = '3700';
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
var app=require('./app');

//Conexion con la base
//mongoose.connect('mongodb+srv://ferchocdh29:grupo7god@cluster1.cnyyzr0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
mongoose.connect('mongodb://localhost:27017/hotel')
.then(()=>{
    console.log('Conexión exitosa con la base de datos de manera local');
    app.listen(port,()=>{
        console.log('Servidor corriendo correctamente en: localhost:3700');
    });
})
.catch(err => console.log(err));

//Subiendo