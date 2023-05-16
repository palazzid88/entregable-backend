//Código de front

const socket = io();

const sendProduct = document.getElementById("submit-btn");
sendProduct.addEventListener("click", (e) => {
  e.preventDefault();

  const prod = {
    title: document.getElementById("product-name").value,
    description: document.getElementById("product-description").value,
    price: document.getElementById("product-price").value,
    thumbnail: document.getElementById("product-image").value,
    code: document.getElementById("product-code").value,
    stock: document.getElementById("products-stock").value,
    status: document.getElementById("product-status").value,
    category: document.getElementById("product-category").value
  };
console.log(prod)
  socket.emit("newProduct", prod);
});

socket.on("productListUpdated", (data) => {
  console.log(JSON.stringify(data));
});





// const socket = io();

// let prod = {}

// const sendProduct = document.getElementById("submit-btn").addEventListener("submit", (e)=> e.preventDefault())
//     prod.title = document.getElementById("product-name").value;
//     prod.subtitle = document.getElementById("product-description").value;
//     prod.price = document.getElementById("product-price").value;
//     prod.img = document.getElementById("product-image").value;
    
//     socket.on("mensaje desde el back al front", (data) => {
//         console.log(JSON.stringify(data));      
//     })
//     socket.emit("newProduct", prod);







// socket.on("mensaje desde el back al front", (productData) => {
//     console.log(JSON.stringify(productData));
//     socket.emit("mensaje desde el back al front", {productData})
// })



// const socket = io();
// const form = document.getElementById("product-form");

// form.addEventListener("submit", (event) => {
//   event.preventDefault();

//   const title = document.getElementById("product-name").value;
//   const description = document.getElementById("product-description").value;
//   const img = document.getElementById("product-image").value;
//   const price = document.getElementById("product-price").value;

//   const productData = {
//     name: title,
//     subtitle: description,
//     thumbnail: img,
//     price: price
//   };

//   socket.emit("newProduct", productData);
// });

// socket.on("mensaje desde el back al front", (productData) => {
//   console.log(JSON.stringify(productData));
// });
