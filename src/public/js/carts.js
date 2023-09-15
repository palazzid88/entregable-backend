function increaseQuantity(productId) {
    console.log("increase ", productId )
    fetch('/api/carts/get-cart-id')
        .then(response => response.json())
        .then(data => {
            const cartId = data.cartId;
            console.log("cartId en product.js", cartId);

            fetch(`/api/carts/${cartId}/products/increase/${productId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Cantidad de producto ${productId} aumentada en el carrito ${cartId}`);
            })
            .catch(error => {
                console.error('Error al aumentar cantidad de producto en el carrito:', error);
            });
        })
        .catch(error => {
            console.error('Error al obtener el cartId:', error);
        });
}

function decreaseQuantity(productId) {
    console.log("decrease ", productId )
    fetch('/api/carts/get-cart-id')
        .then(response => response.json())
        .then(data => {
            const cartId = data.cartId;
            console.log("cartId en product.js", cartId)
            fetch(`/api/carts/${cartId}/products/decrease/${productId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Cantidad de producto ${productId} disminuida en el carrito ${cartId}`);
            })
            .catch(error => {
                console.error('Error al disminuir cantidad de producto en el carrito:', error);
            });
        })
        .catch(error => {
            console.error('Error al obtener el cartId:', error);
        });
}
