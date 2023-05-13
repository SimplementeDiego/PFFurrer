//Agarrar elementos del DOM
const productsContainer = document.getElementById("products-container");
const inputBuscar = document.getElementById("buscar");
const sumaTotal = document.getElementById("resultado");
const cantidadTotal = document.getElementById("cantidad");
const numeroCarrito = document.getElementById("numeroCarrito");
const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");
const modal = document.getElementById("confirmModal");


//Creo variables
const apiUrl = "https://fakestoreapi.com/products";
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
function sumaDecimal(...args) {
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
  fetch("https://fakestoreapi.com/products")
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

    let cantidad = item.price * item.quantity;

    listItem.textContent = `${item.title} x ${
      item.quantity
    } - ${cantidad.toFixed(2)}$`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Quitar";
    removeButton.addEventListener("click", () => removeFromCart(id));

    listItem.appendChild(removeButton);
    cartList.appendChild(listItem);
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



function addToCart(item) {
  if (cart[item.id]) {
    cart[item.id].quantity++;
  } else {
    cart[item.id] = { ...item, quantity: 1 };
  }

  updateCart();
  getTotalPrice();
  saveCartToLocalStorage();
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

function toggleBox() {
  const boxContent = document.querySelector(".box-content");
  boxContent.style.display =
    boxContent.style.display === "none" ? "block" : "none";
}

function saveCartToLocalStorage() {
  const cartJSON = JSON.stringify(cart);
  localStorage.setItem("cart", cartJSON);
}

function restoreCartFromLocalStorage() {
  const cartJSON = localStorage.getItem("cart");
  if (cartJSON) {
    cart = JSON.parse(cartJSON);
    updateCart();
    console.log("antes");
    getTotalPrice();
    console.log("despues");
  }
}

function clearCart() {
  cart = {};

  localStorage.removeItem("cart");

  updateCart();
  getTotalPrice();
}

function closeModal() {
  modal.style.display = "none";
}

function handleConfirmClearCart() {
  clearCart();
  closeModal();
}

function handleCancelClearCart() {
  closeModal();
}

function confirmClearCart() {
  if (getCartItemCount() > 0) {
    modal.style.display = "block";
  }
}

//Añadir eventos
inputBuscar.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    buscar();
  }
});
confirmButton.addEventListener("click", handleConfirmClearCart);
cancelButton.addEventListener("click", handleCancelClearCart);

//Ejecutar al inicio
restoreCartFromLocalStorage();
