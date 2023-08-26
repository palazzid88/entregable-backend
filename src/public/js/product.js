
function addProductToCart(productId) {
    // Obtén el cartId usando la función Fetch que obtuviste antes
    fetch('/api/carts/get-cart') // Cambia la ruta según donde hayas definido el getCartById
        .then(response => response.json())
        .then(data => {
            const cartId = data.cartId;

            // Ahora tienes el cartId y el productId
            // Realiza la llamada Fetch para añadir el producto al carrito
            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
                // Agrega más opciones si es necesario, como headers y body
            })
            .then(response => response.json())
            .then(data => {
                console.log(`producto ${productId} añadido con exito al carrito ${cartId}`);
                Swal.fire("¡Producto añadido al carrito!", "El producto ha sido añadido al carrito con éxito.", "success");

            })
            .catch(error => {
                console.error('Error al añadir producto al carrito:', error);
            });
        })
        .catch(error => {
            console.error('Error al obtener el cartId:', error);
        });
}
