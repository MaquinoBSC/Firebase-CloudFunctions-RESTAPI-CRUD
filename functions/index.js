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
        res.status(500).send(error);
    }
});

app.get('/api/products/:product_id', (req, res)=> {
    (   async()=> {
            try {
                const product_id= req.params.product_id;
        
                const doc= db.collection('products').doc(product_id);//Hacemos referencia a la coleccion 
                const item= await doc.get();//Obtenermos los datos de la coleccion 
                const product= {
                    "id": item.id,
                    "name": item.data().name,//Obtener 
                } 

                res.status(200).json(product);
            } catch (error) {
                res.status(500).send(error);
            }
        }
    )();
});

app.get('/api/products', (req, res)=> {
    (   async()=> {
            try {        
                const query= db.collection('products');//Hacemos referencia a la coleccion 
                const querySnapshot= await query.get();//querySnapcshot contiene un arreglo de objetos que contiene todos los products, el arreglo es llamado docs 
                
                const products= querySnapshot.docs.map((doc)=> (//accedemos al arreglo y los recorremos para obtener los datos de los productos
                    {
                        id: doc.id,//id es el identificativo del documento y asi podemos acceder al id del product
                        name: doc.data().name,//para acceder a los datos que tiene el doc, ejecutamos la funcion data y podemos acceder a los datos que nos importen
                    }
                ))

                res.status(200).json(products);
            } catch (error) {
                res.status(500).send(error);
            }
        }
    )();
});


app.delete('/api/products/:product_id', async(req, res)=> {
    try {
        const product_id= req.params.product_id;
        const doc= db.collection('products').doc(product_id);
        await doc.delete();
        
        return res.status(200).json({
            product_id,
            message: "Producto elminado correctamente",
        });

    } catch (error) {
        res.status(500).send(error);
    }
});


app.put('/api/products/:product_id', async(req, res)=> {
    try {
        const product_id= req.params.product_id;    
        const doc= db.collection('products').doc(product_id);
        
        await doc.update({
            name: req.body.name,
        });
        
        res.status(200).json({
            product_id,
            msg: "Producto actualizado correctamente"
        });
    } catch (error) {
        res.status(500).json(error)
    }
})


app.get('/hello-world', (req, res)=> {
    return res.status(200).json({
        message: "Hello world"
    })
});




exports.app= functions.https.onRequest(app)