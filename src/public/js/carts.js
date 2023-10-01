// function increaseQuantity(productId) {
//     console.log("increase ", productId )
//     fetch('/api/carts/get-cart-id')
//         .then(response => response.json())
//         .then(data => {
//             const cartId = data.cartId;
//             console.log("cartId en product.js", cartId);

//             fetch(`/api/carts/${cartId}/products/increase/${productId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Accept': 'application/json'
//                 }
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(`Cantidad de producto ${productId} aumentada en el carrito ${cartId}`);
//             })
//             .catch(error => {
//                 console.error('Error al aumentar cantidad de producto en el carrito:', error);
//             });
//         })
//         .catch(error => {
//             console.error('Error al obtener el cartId:', error);
//         });
// }

// function decreaseQuantity(productId) {
//     console.log("decrease ", productId )
//     fetch('/api/carts/get-cart-id')
//         .then(response => response.json())
//         .then(data => {
//             const cartId = data.cartId;
//             console.log("cartId en product.js", cartId)
//             fetch(`/api/carts/${cartId}/products/decrease/${productId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Accept': 'application/json'
//                 }
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(`Cantidad de producto ${productId} disminuida en el carrito ${cartId}`);
//             })
//             .catch(error => {
//                 console.error('Error al disminuir cantidad de producto en el carrito:', error);
//             });
//         })
//         .catch(error => {
//             console.error('Error al obtener el cartId:', error);
//         });
// }

function deleteProduct(productId) {
    console.log("productId", productId);
    
    // Obtener cartId
    fetch('/api/carts/get-cart-id')
    .then(response => response.json())
    .then(data => {
        const cartId = data.cartId;
        console.log("cartId en product.js", cartId)

    // Petición DELETE al servidor
        fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'PUT',
        })
        .then((response) => {
            if (response.status === 201) {
            // Recargar la pg
            location.reload();
            } else {
            console.error('Error al eliminar el producto');
            }
        })
    })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
      });
  }

  function updateQuantity(productId) {
    const newQuantity = parseInt(document.getElementById('quantityInput').value);
    console.log("prod en front", productId)
  
    fetch('/api/carts/get-cart-id')
      .then(response => response.json())
      .then(data => {
        const cartId = data.cartId;
        console.log("cartId en product.js", cartId);
  
        // Petición PUT al servidor para actualizar la cantidad
        fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQuantity }),
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
      })
      .catch((error) => {
        console.error('Error al obtener el ID del carrito:', error);
      });
  }
  
  
