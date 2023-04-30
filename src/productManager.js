const fs = require("fs")

class ProductManager {
    static id = 1
    constructor (path) {
        this.path = 'products.json';
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
               const data = await fs.promises.readFile(this.path, "utf-8")
                return JSON.parse(data);
            }
            await fs.promises.writeFile(this.path, JSON.stringify([]));
        }
        catch (error) {
            return (error)
        }
    }

    async addProduct(product) {
        try {
            let products = await this.getProducts();
            this.id = products.length +1;
            product.id = this.id;
            let newProduct = {...product, ...product.id};
            products.push(newProduct);
            await this.saveProducts(products)
        }
        catch (error) { 
            return (error)
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find((prod)=> prod.id == id);
            console.log("getId", product)
            if (!product) {
                console.log("no existe")
                return  (`no existe producto con ID:`);
            }
            return product
        } 
        catch (error) {
            return (error)
        }
    }

    async updateProduct(id, updateProduct) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((prod)=> prod.id == id);
            if (index == -1) {
                console.log("no existe")
                return (`el producto con ID ${id} no existe`)
            }
            products[index] = {...updateProduct, id};
            await this.saveProducts(products);
        }
        catch (error) {
            console.log("el ID no existe");
            return (error)
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((prod)=> prod.id == id);
            if (index === -1){
                return (`No existe producto con ${id}`);
            }
            products.splice(index, 1);
            await this.saveProducts(products);      
        } catch (error) {
            return (error)
        }
        
    }

    async saveProducts(products) {
        try {
            const data = JSON.stringify(products, null, 2);
            await fs.promises.writeFile(this.path, data, err=> {
                if (err) {
                    return (`error`)
                }
            });
        } catch (error) {
            return (error)
        }
      }

      async deleteAll() {
        try {
            await fs.promises.writeFile(this.path, "[]");
        } catch (error) {
            return (error)
        }
      }

}

const product1 = {
    title: "untitulo1",
    description: "unadescription1",
    price: 200,
    thumbnail: "unathumbnail1",
    code: 111,
    stock: 100
}


const productManager = new ProductManager("products.json");


const asyncFn = async ()=> {
    // await productManager.addProduct(product4)
}

asyncFn()

module.exports = ProductManager;