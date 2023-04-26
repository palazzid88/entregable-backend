const fs = require("fs")

class ProductManager {
    static id = 1
    constructor (path) {
        this.path = path;
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '[]')
          }     
    }

    addProduct(product) {
        const products = this.getProducts();
        this.id = products.length +1;
        product.id = this.id;
        let newProduct = {...product, ...product.id};
        products.push(newProduct);
        this.saveProducts(products)

    }


    getProducts() {
        let products;
        try {
            const productsEnJson = fs.readFileSync(this.path, "utf-8");
            products = JSON.parse(productsEnJson)           
        } catch (err) {
            return [];
        }
        return products;
    }


    getProductById(id) {
        const products = this.getProducts();
        const product = products.find((prod)=> prod.id === id);
        if (!product) {
            throw new Error (`no existe producto con ID:`);
        }
        return product
    }


    updateProduct(id, updateProduct) {
        const products = this.getProducts();
        const index = products.findIndex((prod)=> prod.id == id);
        if (index == -1) {
            throw new Error(`el producto con ID ${id} no existe`)
        }
        products[index] = {...updateProduct, id};
        this.saveProducts(products);
    }


    deleteProduct(id) {
        const products = this.getProducts();
        const index = products.findIndex((prod)=> prod.id == id);
        if (index === -1){
            throw new Error (`No existe producto con ${id}`);
        }
        products.splice(index, 1);
        this.saveProducts(products);
        
    }

    saveProducts(products) {
        const data = JSON.stringify(products, null, 2);
        fs.writeFileSync(this.path, data, err=> {
            if (err) {
                throw new Error (`error`)
            }
        });
      }
}



const product7 = {
    title: "untitulo7",
    description: "unadescription7",
    price: 200,
    thumbnail: "unathumbnail7",
    code: 321,
    stock: 100
}


const product8 = {
    title: "titulo8",
    description: "description8",
    price: 200,
    thumbnail: "unathumbnail8",
    code: 234,
    stock: 100
}


const product9 = {
    title: "titulo9",
    description: "description9",
    price: 200,
    thumbnail: "unathumbnail9",
    code: 457,
    stock: 100
}


const product10 = {
    title: "titulo10",
    description: "description10",
    price: 200,
    thumbnail: "unathumbnail10",
    code: 765,
    stock: 100
}

const productManager = new ProductManager("products.json");
productManager.addProduct(product7);
productManager.addProduct(product8);
productManager.addProduct(product9);
productManager.addProduct(product10);

// productManager.deleteProduct();
// productManager.getProductById(1);
// productManager.updateProduct(1, product2);

module.exports = ProductManager;