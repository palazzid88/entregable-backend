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




