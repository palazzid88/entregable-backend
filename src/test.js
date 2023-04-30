

class ProductManager {
    id = 0
    exiseAtributo = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    
    constructor () {
        this.products = [];
    }
   
addProduct (product) {
    let existCode = this.products.some((prod) => prod.code === product.code)
    console.log(existCode, "si es true quiere decir que el código ya existe, si es true no lo agrega");
    if(existCode) {
        return 'This code already exists';
    }
    const allFields = this.exiseAtributo.every((field) => product[field]);
    console.log(allFields, "si es verdadoro: existen todos los campos");
    if (!allFields) {
        return 'Fields missing';
      }
      this.id++;
      product.id = this.id;
      let newProduct = {...product, ...this.id}
      this.products.push(newProduct);
      console.log(this.products);
      return 'Product added';
}

getProducts() {
    console.log(this.products)
    return this.products
}

getProductsById(productId) {
    let findId = this.products.find(prod=> prod.productId === productId);
    if (findId !== undefined) {
        console.log(findId);
        return findId
    }
    else {
        console.log("error");
    }
}
}

// Ejemplo con prod 1
const product = {
    title: "titlulo1",
    description: "description1",
    price: 100,
    thumbnail: "http://staticclvf5a.lavozdelinterior.com.ar/files/imagecache/clv_189-98/promociones/miniatura_270x160_-_ch.jpg",
    code: "abc123",
    stock: 200,
}

// Ejemplo con prod 2
const product2 = {
    title: "titlulo2",
    description: "description2",
    price: 100,
    thumbnail: "http://staticclvf5a.lavozdelinterior.com.ar/files/imagecache/clv_189-98/promociones/miniatura_270x160_-_ch.jpg",
    code: "abc456",
    stock: 200,
} 

// Ejemplo con prod 3
const product3 = {
    title: "titlulo3",
    description: "description3",
    price: 100,
    thumbnail: "http://staticclvf5a.lavozdelinterior.com.ar/files/imagecache/clv_189-98/promociones/miniatura_270x160_-_ch.jpg",
    code: "abc123", //=> con codigo igual
    stock: 200,
}

// Ejemplo con prod 4
const product4 = {
    title: "titlulo1",
    description: "description1",
    price: 100,
    thumbnail: "http://staticclvf5a.lavozdelinterior.com.ar/files/imagecache/clv_189-98/promociones/miniatura_270x160_-_ch.jpg",
    code: "abc789",
    // stock: 200, => Sin Stock!
}



const productManager = new ProductManager();
// productManager.getProducts()
//product.getProducts();

// product.getProductsById();
// console.log(productManager.addProduct(product), "product");
// console.log(productManager.addProduct(product2), "product2");
// console.log(productManager.addProduct(product3), "product3");
// console.log(productManager.addProduct(product4), "product4");



// console.log(productManager, "array");