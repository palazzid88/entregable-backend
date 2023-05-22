//Código de front

// const { id } = require("../../productManager");

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
    stock: document.getElementById("product-stock").value,
    status: document.getElementById("product-status").value,
    category: document.getElementById("product-category").value
  };
console.log("prod", prod)
if (prod.category != "" && prod.code != "" && prod.description != "" && prod.price != "" && prod.status != "" && prod.stock != "" && prod.thumbnail) {
  socket.emit("newProduct", prod);  
} else {
  document.getElementById('err-form').innerHTML = `<p class="p-error" style="color: red">**Debe completar todos los campos</p>`
  console.log("error")
}
});

socket.on("productListUpdated", (data) => {
  console.log(JSON.stringify(data));
  updateProductList(data);
});





function updateProductList(products) {
  const productListElement = document.getElementById("product-list");

  // Crea una cadena de caracteres para almacenar el HTML generado
  let html = "";

  // Recorre la lista de productos actualizados y genera el HTML correspondiente
  products.forEach((product) => {
    html += `
      <div class="card mb-3" style="">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${product.thumbnail}" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text">${product.price}</p>
              <p class="card-text">${product.category}</p>
              <button type="submit" onclick="deleteProduct('${product.id}')">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Actualiza el contenido del elemento "product-list" con el HTML generado
  productListElement.innerHTML = html;
}



function deleteProduct(productId) {
  console.log(`Eliminar producto con ID: ${productId}`);
  socket.emit("deleteProdId", productId)
}

