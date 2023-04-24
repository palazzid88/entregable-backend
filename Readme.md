Se crea constructor de la clase ProductManager
dentro del mismo se llama al método addProduct() que verifica condiciones para añadir el producto al array this.product[].

En caso de que el producto contenga un código distinto a los que ya se encuentren en el array, y posea todos los atributos en el mismo, podrá ser añadido al array => 

* Se utiliza método some(), para comparar los códigos de los productos,

* Se utiliza método every(), para verificar que existan todos los campos dentro del objeto, para ello lo compara con un patrón de atributos existeAtributo = [];

En caso de que todas estas condiciones se cumplan, se le añade un id, con valor incremental a cada objeto, y se pushea a array=> this.products = [];

Se ponen como ejemplo 4 productos en los que se prueban las distintas alternativas de la condición.

Por último se crea una instancia new ProductManager.

