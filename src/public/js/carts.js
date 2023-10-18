function getCartId() {
  // Obtener cartId
  return fetch('/api/carts/get-cart-id')
      .then(response => response.json())
      .then(data => {
          const cartId = data.cartId;
          return cartId;
      });
}

function deleteProduct(productId) {
  
  getCartId()
      .then(cartId => {
          // Petición DELETE al servidor
          return fetch(`/api/carts/${cartId}/product/${productId}`, {
              method: 'DELETE',
          });
      })
      .then((response) => {
          if (response.status === 201) {
              // Recargar la página
              location.reload();
          } else {
              console.error('Error al eliminar el producto');
          }
      })
      .catch((error) => {
          console.error('Error al eliminar el producto:', error);
      });
}

function updateQuantity(productId) {
  const newQuantity = parseInt(document.getElementById('quantityInput').value);

  getCartId()
      .then(cartId => {
          // Petición PUT al servidor para actualizar la cantidad
          return fetch(`/api/carts/${cartId}/product/${productId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ quantity: newQuantity }),
          });
      })
      .then((response) => {
          if (response.status === 201) {
              // Recargar la página
              location.reload();
          } else {
              console.error('Error al actualizar la cantidad del producto');
          }
      })
      .catch((error) => {
          console.error('Error al actualizar la cantidad:', error);
      });
}


function deleteProductsInCart() {
  fetch('/api/carts/get-cart-id')
    .then(response => response.json())
    .then(data => {
        const cartId = data.cartId;

    // Petición DELETE al servidor
        fetch(`/api/carts/${cartId}`, {
        method: 'DELETE',
        })
        .then((response) => {
            if (response.status === 201) {
            // Recargar la pg
            location.reload();
            } else {
            console.error('Error al vaciar carrito');
            }
        })
    })
      .catch((error) => {
        console.error('Error al vaciar el carrito:', error);
      });
  }


  
  
