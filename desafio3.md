### DESAFÍO ENTREGABLE - PROCESO DE TESTING

## Servidores con express

# Desarrollar un servidor basado en express donde podamos 
# hacer consultas a nuestro archivo de productos.


se importa Product Manager
==> module.exports = ProductManager; <==
==> const ProductManager = require('./productManager'); <==
==> const path = './products.json'<==
==> const productManager = new ProductManager <==


=> Se instalarán las dependencias a partir del comando npm install //=> (Hecho)

=> Se echará a andar el servidor //=> (Hecho)

=> Se revisará que el archivo YA CUENTE CON AL MENOS DIEZ PRODUCTOS CREADOS //=> (Hecho)
al momento de su entrega, es importante para que los tutores 
no tengan que crear los productos por sí mismos, 
y así agilizar el proceso de tu evaluación.

=> Se corroborará que el servidor esté corriendo en el puerto 8080. //=> (Hecho) 

=> Se mandará a llamar desde el navegador a la url http://localhost:8080/products //=> (Hecho) 
sin query, eso debe devolver todos los 10 productos.

=> Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , 
eso debe devolver sólo los primeros 5 de los 10 productos.

=> Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, //=> (Hecho a medias)
eso debe devolver sólo el producto con id=2.

=> Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, //=> (Hecho a medias)
al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.

=> Se añade método clearAll(), para vacíar el contenido de this.path con "[]"