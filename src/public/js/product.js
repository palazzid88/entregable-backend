
function addProductToCart(productId) {
    // cartId usando la función Fetch
    fetch('/api/carts/get-cart-id')
        .then(response => response.json())
        .then(data => {
            const cartId = data.cartId;
            // Se llamada Fetch para añadir el producto al carrito
            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "producto añadido al carrito") {
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