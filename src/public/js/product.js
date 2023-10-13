
function addProductToCart(productId) {
    console.log("products", productId)
    // Obtén el cartId usando la función Fetch que obtuviste antes
    fetch('/api/carts/get-cart-id') // Cambia la ruta según donde hayas definido el getCartById
        .then(response => response.json())
        .then(data => {
            const cartId = data.cartId;
            console.log("cartId en product.js", cartId)
            console.log("prodId", productId)
            // Ahora tienes el cartId y el productId
            // Realiza la llamada Fetch para añadir el producto al carrito
            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
                // Agrega más opciones si es necesario, como headers y body
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "producto añadido al carrito") {
                    console.log(`Producto ${productId} añadido con éxito al carrito ${cartId}`);
                    Swal.fire("¡Producto añadido al carrito!", "El producto ha sido añadido al carrito con éxito.", "success");
                } else {
                    console.error('No se pudo agregar el producto al carrito:', data.message);
                    Swal.fire("Error", "No puede añadir sus propios productos al carrito.", "error");
                }
            })
            .catch(error => {
                console.error('Error al añadir producto al carrito:', error);
                Swal.fire("Error", "Ocurrió un error al intentar agregar el producto al carrito.", "error");
            });
            
        })
    }
        
