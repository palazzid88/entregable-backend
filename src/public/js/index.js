const socket = io();


// ## APP CHAT ##
//APP MENSAJERÍA DESDE EL FRONT

// 1) enviar un mensaje desde el front:
// setInterval(()=> {
  function sendMsg() {
    const messages = {
      user: document.getElementById("user-emit").value,
      message: document.getElementById("msg-emit").value 
    }
  console.log("chat en index", messages)
  
    socket.emit("chat-front-to-back", { messages })
  }

// 3) recibir el array de mensajes que envía el back, y mostrarlos en pantalla

socket.on('chat-back-to-all', (msgs)=> {
  console.log("msg en front", msgs)

  let messagesHTML = '';
  msgs.forEach((msg) => {
    messagesHTML += `<p>${msg.user}:</p>
                      <p> ${msg.message}</p>`;
    console.log("probando msg en forEach", msg.user, msg.message)
  });

  // Actualizar el contenido del elemento divMsg
  const divMsg = document.getElementById("div-msg");
  divMsg.innerHTML = messagesHTML;
})



// -----------------WEBSOCKETS------------------
// localhost:8080/realTimeProducts
// FORMULARIO CARGA DE PRODUCTOS DESDE EL FRONT 



const sendProduct = document.getElementById("submit-btn");
sendProduct.addEventListener("click", (e) => {
  e.preventDefault();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('email');

  const prod = {
    title: document.getElementById("product-name").value,
    description: document.getElementById("product-description").value,
    price: document.getElementById("product-price").value,
    thumbnail: document.getElementById("product-image").value,
    code: document.getElementById("product-code").value,
    stock: document.getElementById("product-stock").value,
    status: document.getElementById("product-status").value,
    category: document.getElementById("product-category").value,
    owner: email,
  };


  console.log("prod en index", prod);
  console.log("owner", prod.owner);

  if (prod.title !== "" && prod.description !== "" && prod.price !== "" && prod.category !== "" && prod.code !== "" && prod.status !== "" && prod.stock !== "" && prod.thumbnail !== "") {
    console.log("Se manda al socket en emit");
    socket.emit("newProduct", prod);
  } else {
    document.getElementById('err-form').innerHTML = `<p class="p-error" style="color: red">**Debe completar todos los campos</p>`;
    console.log("Error");
  }
});

socket.on("productListUpdated", (data) => {
  console.log(JSON.stringify(data));
  updateProductList(data);
});






function updateProductList(products) {
  console.log("ingresó en updt list ")
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
              <button class="btn-btn-primary" type="submit" onclick="deleteProduct('${product._id}')">Eliminar</button>
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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('email');

  console.log("email", email)

  const prod = {
    title: document.getElementById("product-name").value,
    description: document.getElementById("product-description").value,
    price: document.getElementById("product-price").value,
    thumbnail: document.getElementById("product-image").value,
    code: document.getElementById("product-code").value,
    stock: document.getElementById("product-stock").value,
    status: document.getElementById("product-status").value,
    category: document.getElementById("product-category").value,
    owner: email,
  };

  const owner = prod.owner


  console.log(`Eliminar producto con ID: ${productId}`);
  console.log("owner en front", owner)
  socket.emit("deleteProdId", productId, owner)

}