const functions = require("firebase-functions");
const admin= require('firebase-admin');

const express= require('express');
const app= express();

//Generar permisos para usar los servicios de firebase a traves de nuestro proyecto en firebase
// y tambien inicializamos la aplicacion de FB
admin.initializeApp({
    //permissions es un archivo que se descarga en firebase (configuracion del proyecto -> cuentas de servicio -> generar nueva clave privada)
    credential: admin.credential.cert('./permissions.json'),
    //la url la encuentramos en firebase (configuracion del proyecto -> cuentas de servicio)
    databaseURL: "https://cloudfunctions-583e9-default-rtdb.firebaseio.com",
});

