
//------------URL para Carts----------------
// const API_URL = window.location.protocol + '//' + window.location.host + '/' + "api/";
// const urlCodespace =  "https://palazzid88-ideal-journey-9r7xqp6rqq4cx5g-8080.preview.app.github.dev" //=> se utiliza cuando desarrollo codigo desde codeSpace en mv
// const urlLocal = "http://localhost:8080/"
// console.log("se inició script home")

//-------------Create cart------------------

// Permanencia en localStorage del cart
// const cartId = localStorage.getItem('cartId');
// console.log("existe cart?", cartId)
// console.log(urlCodespace`/api/carts`)


// if (!cartId) {
//     document.addEventListener('DOMContentLoaded', function() {
//       console.log("se llama al fetch");
//       fetch(`http://localhost:8080/api/carts`,
//          { method: 'GET' })
//         .then(response => response.json())
//         .then(cartData => {
//             const newCartId = cartData.result._id;
//             console.log("ID:", cartId)
//           console.log("respuesta del fetch", cartData); 
//           localStorage.setItem('cartId', newCartId);

//         })
//         .catch(error => {
//           console.error(error);
//         });
//     });
// }










//esto se borro el 25-8-23
//----------Add product to cart----------------

// function addProductToCart(idProduct) {
//   console.log("ingreso a la fx addProductToCart")
//     const data = {
//         quantity: 1
//       };
//     // if (cartId) {
//         fetch(`http://localhost:8080/api/carts/${cartId}/products/${idProduct}`,
//           {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//             })
//           .then(response => response.json())
//           .then(prodInCart => {
//             console.log("producto añadido con éxito")
//             console.log("respuesta fetch", prodInCart)
//             Swal.fire({
//               icon: 'success',
//               title: 'Ok!',
//               text: 'Añadido al carrito',
//             })
//             if (prodInCart) {
//               console.log("producto añadido con éxito")
//             }
//          })
//     }

























  // }


  //   function addProdToCart(idProduct) {
  //     const url = `${API_URL}carts/${cartId}/products/${idProduct}`;
  //     fetch(url, {
  //         method: 'PUT'
  //     })
  //         .then(response => response.json())
  //         .then(data => {
  //             // Handle the response data
  //             console.log(data);
  //         })
  //         .catch(error => {
  //             // Handle any errors
  //             console.error(error);
  //         });
  // }


  
  // fetch('/api/carts/CART_ID/products/PRODUCT_ID', {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  // })
  //   .then(response => response.json())
  //   .then(result => {
  //     // Manejar la respuesta del servidor
  //     console.log(result);
  //   })
  //   .catch(error => {
  //     // Manejar errores
  //     console.error(error);
  //   });
  