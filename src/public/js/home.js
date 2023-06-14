
console.log("se inició script home")

//-------------Create cart------------------

// Permanencia en localStorage del cart
const cartId = localStorage.getItem('cartId');
console.log("existe cart?", cartId)


if (!cartId) {
    document.addEventListener('DOMContentLoaded', function() {
      console.log("se llama al fetch")
      fetch('http://localhost:8080/api/carts/', { method: 'GET' })
        .then(response => response.json())
        .then(cartData => {
            const newCartId = cartData.result._id;
            console.log("ID:", cartId)
          console.log("respuesta del fetch", cartData); 
          localStorage.setItem('cartId', newCartId);

        })
        .catch(error => {
          console.error(error);
        });
    });
}


//----------Add product to cart----------------

function addProductToCart(idProduct) {
    const data = {
        quantity: 1
      };
      
    if (cartId) {
        console.log(`http://localhost:8080/api/carts/${cartId}/products/${idProduct}`)
        fetch('/api/carts/CART_ID/products/PRODUCT_ID', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
         .then(prodInCart => {
            console.log("producto añadido con éxito")
            console.log("respuesta fetch", prodInCart)
         })
    }
}

  
  fetch('/api/carts/CART_ID/products/PRODUCT_ID', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      // Manejar la respuesta del servidor
      console.log(result);
    })
    .catch(error => {
      // Manejar errores
      console.error(error);
    });
  