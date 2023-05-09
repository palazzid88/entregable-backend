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
            let products = await this.getProducts();
            this.id = products.length +1;
            product.id = this.id;
            let newProduct = {...product, id: this.id.toString()};
            products.push(newProduct);
            await this.saveProducts(products)
        }
        catch (error) { 
            return (error)
        }
    }

    async getProductById(pid) {
        try {
            const products = await this.getProducts();
            const product = products.find((prod)=> prod.id === pid);

            if (!product) {
                return null
            }
            return product;
        } 
        catch (error) {
            return error
        }
    }

    async updateProduct(id, updateProduct) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((prod)=> prod.id == id);
            if (index === -1) {
                throw new Error(`no existe producto con ID:${id}`)
            }
            products[index] = {...updateProduct, id};
            await this.saveProducts(products);
        }
        catch (err) {
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((prod)=> prod.id == id);
            if (index === -1) {
                throw new Error(`no existe producto con ID:${id}`)
            }
            products.splice(index, 1);

            await this.saveProducts(products);      
        } catch (err) {
            throw (err)
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
    title: "untitulo3",
    description: "unadescription3",
    price: 200,
    thumbnail: ["./public/img/imgG, ./public/img/imgH, ./public/img/imgI"],
    code: 333,
    stock: 100,
    status: true,
    category: "category A"
}


const productManager = new ProductManager("products.json");


// const asyncFn = async ()=> {
//     await productManager.getProductById(100)
// }

// asyncFn()

module.exports = ProductManager;