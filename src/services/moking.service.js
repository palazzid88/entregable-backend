class MockingService {
    generateMockProducts() {
      const mockProducts = [];
  
      for (let i = 1; i <= 100; i++) {
        const mockProduct = {
          title: `Mock Product ${i}`,
          description: `This is a mock product ${i}`,
          price: Math.random() * 100,
          thumbnail: `https://example.com/thumbnail_${i}.jpg`,
          code: `MCK-${i}`,
          stock: Math.floor(Math.random() * 100),
          status: 'active',
          category: 'Mock Category',
        };
        mockProducts.push(mockProduct);
      }
  
      return mockProducts;
    }
  }
  
  module.exports = new MockingService();
  