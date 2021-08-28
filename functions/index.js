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

const db= admin.firestore();//aqui usamos admin que ya esta autorizado para usar los servicios, que queremos usar el servicio firestore

app.post('/api/products', async (req, res)=> {
    try {
        await db.collection('products').doc(`/${req.body.id}/`).create({
            name: req.body.name
        });
    
        return res.status(200).json({
            status: 200,
            msg: "El producto se agrego correctamente"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

app.get('/hello-world', (req, res)=> {
    return res.status(200).json({
        message: "Hello world"
    })
});


exports.app= functions.https.onRequest(app)