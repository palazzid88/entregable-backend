### .ENV ###

PORT=8080
DB_NAME=PROY BKND
MONGO_STRING=
MONGO_USER=palazzid88
MONGO_PASS=qv500UC1DtMcjUj8
GITHUB_CLIENT_ID= Iv1.27c1c117c1448b6b
GITHUB_CLIENT_SECRET= bcbdceabf553a5a0b26c812a37ec8617fefd5f9a
GITHUB_CALLBACK_URL= http://localhost:8080/api/sessions/githubcallback


### Práctica Integradora: ###

*   Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto.

*   Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones 
    - "schemas".
    - “carts” 
    - “messages”
    - “products”

*   Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”

*   Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB.

*   Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”

*   Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem

*   NO ELIMINAR FileSystem de tu proyecto

*   Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase.

*    Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). formato es:  {user:correoDelUsuario, message: mensaje del usuario}







#### DESAFÍO WEBSOcKETS ####

# Consigna #

* Configurar nuestro proyecto para que trabaje con Handlebars y websocket.

* Aspectos a incluir

    - Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.
    - Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento
    - Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
    - Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.
    - Se recomienda que, para la creación y eliminación de un producto, Se cree un formulario simple en la vista  realTimeProducts.handlebars. Para que el contenido se envíe desde websockets y no HTTP.
    - Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST?



#### FIN DESAFÍO WEBSOCKETS ####

<--------------------------------->




#### 1ER ENTREGA PROYECTO FINAL ####

<=> ## REPORTE ## <=>
# enlace de test en postman:

* https://documenter.getpostman.com/view/27147400/2s93eZyX3k




<=> ## CONSIGNA ## <=>

# Se desarrollará un servidor que contenga los endpoints y servicios necesarios para gestionar los productos y carritos de compra en el e-commerce #


# CONSIGNA #

* Se debe entregar

Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: 



# PRODUCTS #
Para el manejo de productos, el cual tendrá su router en /api/products/ , configurar las siguientes rutas:

* Las rutas:
+ GET /: (hecho)
    -  Deberá listar todos los productos de la base. Incluyendo la limitación ?limit del desafío anterior.

+ GET /:pid: (hecho)
    -  Deberá traer sólo el producto con el id proporcionado 

+ POST / (Hecho)
    -  Deberá agregar un nuevo producto con los campos:
        * id: Number/String  A tu elección, el id NO se manda desde body, se autogenera como lo hemos visto desde los primeros entregables, asegurando que NUNCA se repetirán los ids en el archivo.
        * title:String,
        * description:String
        * code:String
        * price:Number
        * status:Boolean
        * stock:Number 
        * category:String
        * thumbnails:Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
        * Status es true por defecto.
        * Todos los campos son obligatorios, a excepción de thumbnails

+ PUT /:pid (hecho)
    - deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.(hecho)

+ DELETE /:pid (Hecho)
    - Deberá eliminar el producto con el pid indicado.



# CARTS #
Para el carrito, el cual tendrá su router en /api/carts/, configurar dos rutas:

* Las rutas:
+ raíz POST /:(Hecho)
    - Deberá crear un nuevo carrito con la siguiente estructura:
        * Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
        * products: Array que contendrá objetos que representen cada producto => {idCarrito: “100”, productos: []}

+ La ruta GET /:cid (Hecho)
    - Deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

+ POST /:cid/product/:pid (Hecho)
    - Deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
        * product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
        - idCarrito: “100”,
        - productos: [ {idProduct: “100”, quantity: 4}, ]
    - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
    - Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 



# PERSITENCIA # 
* La persistencia de la información se implementará utilizando el file system, donde los archivos “productos.json” y “carrito.json”, respaldan la información.
* No es necesario realizar ninguna implementación visual, todo el flujo se puede realizar por Postman o por el cliente de tu preferencia. (hecho)





#### FIN 1ER ENTREGA PROYECTO FINAL ####

<--------------------------------->


### server.js - ENTREGABLE 3 ###

* Se crea server.js donde se ejecuta express.js.
* en carpeta img se encuentran las capturas de pantalla de las resoluciones en Postman
* Dentro de la ejecución de express se crea métodos:

# //=> GET HOME:
Devuelve obj Alumno en direccion ("/")

# //=> GET PRODUCTS:
Devuelve todos los objetos, siempre y cuando no posea un query.limit, en ese caso devuelve la cantidad de objetos de limit.

# //=> GET PRODUCTS POR ID:
Devuelve el producto del ID declarado en ("/api/products/ID"), en caso de no encontrarlo envía un error.


# Información secundaria #
* Se añade método deleteAll(); en constructor, que eimiina y vacía el arrary de productos JSON.
* En help.md se guarda información importante de ayuda memoria.
* En desafio3.md se encuentra la consigna del desafío.


#### FIN ENTREGABLE #3 ####




### productManager.js - ENTREGABLE 2 ###


Se crea una clase con un constructor ProductManager, que recibe como parámetro this.path, se asigna un id static.

El método addProduct(); 
    trae los productos que se encuentren en el archivo JSON (this.path), por medio del método getProducts().
Añade un id al producto a añadir
realiza el push al array y llama al método saveProducts, quien convierte en string los datos del objeto y los escribe en el archivo JSON

El método getProducts();
    Devuelve los productos del archivo JSON parseados.

getProductById();
    trae los productos que se encuentren en el archivo JSON (this.path), por medio del método getProducts().
Busca en el array de productos si hay un producto con el id que se pasa por parámetro, si el producto existe lo retorna, si no existe envía error.

updateProduct();
    trae los productos que se encuentren en el archivo JSON (this.path), por medio del método getProducts().
Se utiliza el método findIndex para averiguar el índice del producto con el id que se pasó por parámetro, si existe se toma ese producto con el índice calculado, se la añade updateProduct con el id

deleteProduct();
    Trae los productos que se encuentren en el archivo JSON (this.path), por medio del método getProducts().
Se utiliza el método findIndex para averiguar el índice del producto con el id que se pasó por parámetro, si existe se toma ese producto con el índice calculado, se toma el array de productos y se le aplica el método splice para eliminar el producto del array.
Se llama al método saveProducts(), quien convierte en string los datos del objeto y los escribe en el archivo JSON;

El método saveProducts(),
    Es un método para reutilizar la carga de los productos, modificados, cargados, borrados, al JSON.
(similar al método getProducts())


### FIN ENTREGABLE #2 ###


### Test.js - ENTREGABLE #1 ###


Se crea constructor de la clase ProductManager
dentro del mismo se llama al método addProduct() que verifica condiciones para añadir el producto al array this.product[].

En caso de que el producto contenga un código distinto a los que ya se encuentren en el array, y posea todos los atributos en el mismo, podrá ser añadido al array => 

* Se utiliza método some(), para comparar los códigos de los productos,

* Se utiliza método every(), para verificar que existan todos los campos dentro del objeto, para ello lo compara con un patrón de atributos existeAtributo = [];

En caso de que todas estas condiciones se cumplan, se le añade un id, con valor incremental a cada objeto, y se pushea a array=> this.products = [];

Se ponen como ejemplo 4 productos en los que se prueban las distintas alternativas de la condición.

Por último se crea una instancia new ProductManager.


### FIN ENTREGABLE #1 ###




