const admin= require('firebase-admin');

const functions = require("firebase-functions");

const express= require('express');
const app= express();

//Generar permisos para usar los servicios de firebase a traves de nuestro proyecto en firebase
// y tambien inicializamos la aplicacion de FB
admin.initializeApp({
    //permissions es un archivo que se descarga en firebase (configuracion del proyecto -> cuentas de servicio -> generar nueva clave privada)
    credential: admin.credential.applicationDefault(),
    //la url la encuentramos en firebase (configuracion del proyecto -> cuentas de servicio)
    databaseURL: "https://cloudfunctions-583e9-default-rtdb.firebaseio.com",
});

const db= admin.firestore();//aqui usamos admin que ya esta autorizado para usar los servicios, que queremos usar el servicio firestore


app.use(require('./routes/products.routes'));

app.get('/hello-world', (req, res)=> {
    return res.status(200).json({
        message: "Hello world"
    })
});


exports.logProducts= functions.firestore.document('/products/{id}').onCreate( async(snap, context)=> {
    const idProduct= context.params.id;
    const logProducts= admin.firestore().collection('activities');
    
    await logProducts.add({
        text: `a new product was added with id ${idProduct}`
    });
});

exports.app= functions.https.onRequest(app);