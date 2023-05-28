//Agarrar elementos del DOM
const productsContainer = document.getElementById("products-container");
const inputBuscar = document.getElementById("buscar");
const sumaTotal = document.getElementById("resultado");
const cantidadTotal = document.getElementById("cantidad");
const numeroCarrito = document.getElementById("numeroCarrito");
const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");
const modal = document.getElementById("confirmModal");
const modalPay = document.getElementById("payModal");
const modalCarrito = document.getElementById("modalCarrito");
const logo = document.getElementById("logo");
const home = document.getElementById("home");
const carrito = document.getElementById("carrito");
const vaciar = document.getElementById("vaciar");
const volver = document.getElementById("volver");
const pagar = document.getElementById("pagar");
const collectionE = document.getElementById("collection");
const salesE = document.getElementById("sales");
const buscarBoton = document.getElementById("buscarBoton");
const confirmarVaciar = document.getElementById("confirmarVaciar");
const rechazarVaciar = document.getElementById("rechazarVaciar");
const confirmarComprar = document.getElementById("confirmarComprar");
const rechazarComprar = document.getElementById("rechazarComprar");

//Añadir eventos
inputBuscar.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    buscar();
  }
});
logo.addEventListener("click", reset);
home.addEventListener("click", reset);
carrito.addEventListener("click", toggleCarrito);
vaciar.addEventListener("click", toggleVaciar);
volver.addEventListener("click", toggleCarrito);
pagar.addEventListener("click", toggleCompra);
collectionE.addEventListener("click", collection);
salesE.addEventListener("click", sales);
buscarBoton.addEventListener("click", buscar);
confirmarVaciar.addEventListener("click", deleteCart);
rechazarVaciar.addEventListener("click", toggleVaciar);
confirmarComprar.addEventListener("click", payCart);
rechazarComprar.addEventListener("click", toggleCompra);

//Creo variables
const apiUrl = "https://fakestoreapi.com/products"; 
//const apiUrl = "./data.json"; En caso de que FakeStoreApi no funcione, usar esta linea
const products = [];
const primeraMitad = [];
const segundaMitad = [];
let cart = {};

//Acciones independientes
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 20; i++) {
      if (i % 2 == 0) {
        primeraMitad.push(data[i]);
      } else {
        segundaMitad.push(data[i]);
      }
      products.push(data[i]);
    }
    data.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("item");
      productDiv.innerHTML = `
              <h2>${product.title}</h2>
              <img src="${product.image}" alt="${product.title}">
              <p>Price: $${product.price}</p>
            `;

      const addButton = document.createElement("button");
      addButton.textContent = "Agregar al carro";
      addButton.addEventListener("click", () => addToCart(product));
      productDiv.appendChild(addButton);

      productsContainer.appendChild(productDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

//Funciones
function sumaDecimal(...args) { //Para evitar las sumas de JS que quedan .000000000003
  let res = 0;
  if (args.length > 0) {
    let arrDecimales = [];
    args.forEach((element) => {
      const decimales = (element.toString().split(".")[1] || "").length || 0;
      arrDecimales.push(decimales);
    });
    const multiplicador = Math.pow(10, Math.max(...arrDecimales));
    args.forEach((element) => {
      res += element * multiplicador;
    });
    res = res / multiplicador;
  }
  return res.toFixed(2);
}

function buscar() {
  const desc = inputBuscar.value.trim().toLowerCase();
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(desc)
      );
      productsContainer.innerHTML = "";
      filteredData.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("item");
        productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>Price: $${product.price}</p>
      `;
        const addButton = document.createElement("button");
        addButton.textContent = "Agregar al carro";
        addButton.addEventListener("click", () => addToCart(product));
        productDiv.appendChild(addButton);
        productsContainer.appendChild(productDiv);
      });
    })
    .catch((error) => console.error(error));
}

function reset() {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("item");
    productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>Price: $${product.price}</p>
      `;
    const addButton = document.createElement("button");
    addButton.textContent = "Agregar al carro";
    addButton.addEventListener("click", () => addToCart(product));
    productDiv.appendChild(addButton);
    productsContainer.appendChild(productDiv);
  });
}

function collection() {
  productsContainer.innerHTML = "";
  primeraMitad.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("item");
    productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>Price: $${product.price}</p>
      `;
    const addButton = document.createElement("button");
    addButton.textContent = "Agregar al carro";
    addButton.addEventListener("click", () => addToCart(product));
    productDiv.appendChild(addButton);
    productsContainer.appendChild(productDiv);
  });
}

function sales() {
  productsContainer.innerHTML = "";
  segundaMitad.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("item");
    productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>Price: $${product.price}</p>
      `;
    const addButton = document.createElement("button");
    addButton.textContent = "Agregar al carro";
    addButton.addEventListener("click", () => addToCart(product));
    productDiv.appendChild(addButton);
    productsContainer.appendChild(productDiv);
  });
}

function updateCart() {
  const cartList = document.getElementById("cart");
  cartList.innerHTML = "";

  for (const [id, item] of Object.entries(cart)) {
    const listItem = document.createElement("li");

    const parr = document.createElement("p");
    parr.classList.add("nombre");

    const precio = document.createElement("p");
    precio.classList.add("precio");

    const linea = document.createElement("hr");

    let cantidad = item.price * item.quantity;

    parr.textContent = `${item.title}`;

    precio.textContent = `x ${item.quantity} = ${cantidad.toFixed(2)}$`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Quitar";
    removeButton.addEventListener("click", () => removeFromCart(id));

    listItem.appendChild(parr);
    listItem.appendChild(precio);
    listItem.appendChild(removeButton);

    cartList.appendChild(listItem);
    cartList.appendChild(linea);
  }
}

function getCartItemCount() {
  let itemCount = 0;

  for (const item of Object.values(cart)) {
    itemCount += item.quantity;
  }

  return itemCount;
}

function getTotalPrice() {
  let totalPrice = 0;
  for (const id in cart) {
    if (Object.hasOwnProperty.call(cart, id)) {
      const element = cart[id];
      totalPrice = sumaDecimal(totalPrice, cart[id].price * cart[id].quantity);
    }
  }
  cantidadTotal.innerHTML = getCartItemCount();
  numeroCarrito.innerHTML = getCartItemCount();
  sumaTotal.innerHTML = totalPrice;
}

//Agregar y eliminar
function addToCart(item) {
  if (cart[item.id]) {
    cart[item.id].quantity++;
  } else {
    cart[item.id] = { ...item, quantity: 1 };
  }

  updateCart();
  getTotalPrice();
  saveCartToLocalStorage();

  const texto = "Producto agregado. Total de productos: " + getCartItemCount();

  Toastify({
    text: texto,
    duration: 3000,
    newWindow: true,
    close: true,
    className: "toast-message",
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      borderRadius: "10px",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

function removeFromCart(itemId) {
  if (cart[itemId]) {
    cart[itemId].quantity--;

    if (cart[itemId].quantity === 0) {
      delete cart[itemId];
    }

    updateCart();
    getTotalPrice();
    saveCartToLocalStorage();
  }
}

//Mostrar carrito
function toggleCarrito() {
  if (modalCarrito.classList.contains("class-hide")) {
    modalCarrito.classList.add("class-show");
    modalCarrito.classList.remove("class-hide");
  } else {
    modalCarrito.classList.add("class-hide");
    modalCarrito.classList.remove("class-show");
  }
}

//Vaciar
function clearCart() {
  if (getCartItemCount() > 0) {
    cart = {};

    localStorage.removeItem("cart");

    updateCart();
    getTotalPrice();
  }
}

//Eliminar
function toggleVaciar() {
  if (getCartItemCount() > 0) {
    if (modal.classList.contains("class-hide")) {
      modal.classList.add("class-show");
      modal.classList.remove("class-hide");
    } else {
      modal.classList.add("class-hide");
      modal.classList.remove("class-show");
    }
  }
}

function deleteCart() {
  if (getCartItemCount() > 0) {
    toggleVaciar();
    clearCart();
    const texto = "Carrito vaciado";
    Toastify({
      text: texto,
      duration: 3000,
      newWindow: true,
      close: true,
      className: "toast-message",
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
        borderRadius: "10px",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
}

//Compra
function toggleCompra() {
  if (getCartItemCount() > 0) {
    if (modalPay.classList.contains("class-hide")) {
      modalPay.classList.add("class-show");
      modalPay.classList.remove("class-hide");
    } else {
      modalPay.classList.add("class-hide");
      modalPay.classList.remove("class-show");
    }
  }
}

function confirmPayCart() {
  if (getCartItemCount() > 0) {
    modal.style.display = "block";
  }
}

function payCart() {
  if (getCartItemCount() > 0) {
    toggleCompra(); //cerrar modal
    clearCart();
    const texto = "¡COMPRA REALIZADA!";
    Toastify({
      text: texto,
      duration: 3000,
      newWindow: true,
      close: true,
      className: "toast-message",
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "green",
        borderRadius: "10px",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
}

//Storage
function saveCartToLocalStorage() {
  const cartJSON = JSON.stringify(cart);
  localStorage.setItem("cart", cartJSON);
}

function restoreCartFromLocalStorage() {
  const cartJSON = localStorage.getItem("cart");
  if (cartJSON) {
    cart = JSON.parse(cartJSON);
    updateCart();
    getTotalPrice();
  }
}

//Ejecutar al inicio
restoreCartFromLocalStorage();
