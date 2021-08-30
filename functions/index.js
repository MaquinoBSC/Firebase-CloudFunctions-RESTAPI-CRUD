const functions = require("firebase-functions");

const express= require('express');
const app= express();

//Generar permisos para usar los servicios de firebase a traves de nuestro proyecto en firebase
// y tambien inicializamos la aplicacion de FB

app.use(require('./routes/products.routes'));

app.get('/hello-world', (req, res)=> {
    return res.status(200).json({
        message: "Hello world"
    })
});

exports.app= functions.https.onRequest(app)