const ProductModel = require('./products.model');

function generateMockProducts(count = 100) {
    const mockProducts = [];
  
    for (let i = 1; i <= count; i++) {
      mockProducts.push({
        title: `Product ${i}`,
        description: `Description for Product ${i}`,
        price: Math.floor(Math.random() * 100) + 1,
        thumbnail: `thumbnail-url-${i}`,
        code: `CODE-${i}`,
        stock: Math.floor(Math.random() * 100) + 1,
        status: 'active',
        category: 'Uncategorized',
      });
    }
  
    return mockProducts;
  }
  