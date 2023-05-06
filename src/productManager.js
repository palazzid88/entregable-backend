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

    async createProduct() {
        const product = await this.addProduct(req.body)
    }

    async addProduct(product) {
        try {
            console.log("recibe", product)
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
            if (!product) {
                return  (`no existe producto con ID: ${id}` );
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

const product3 = {
    title: "untitulo5",
    description: "unadescription5",
    price: 200,
    thumbnail: "unathumbnail5",
    code: 555,
    stock: 100
}


const productManager = new ProductManager("products.json");


const asyncFn = async ()=> {
    // await productManager.addProduct(product3)
}

asyncFn()

module.exports = ProductManager;