// Definir la lista de productos
let productos = [
  { nombre: "Camiseta", categoria: "Ropa", precio: 20 },
  { nombre: "Pantalón", categoria: "Ropa", precio: 40 },
  { nombre: "Zapatillas", categoria: "Calzado", precio: 50 },
  { nombre: "Botas", categoria: "Calzado", precio: 70 },
  { nombre: "Mesa", categoria: "Muebles", precio: 100 },
  { nombre: "Silla", categoria: "Muebles", precio: 50 },
  { nombre: "Cafetera", categoria: "Electrodomésticos", precio: 80 },
  { nombre: "Batidora", categoria: "Electrodomésticos", precio: 60 },
  { nombre: "Libro", categoria: "Libros", precio: 15 },
  { nombre: "Disco", categoria: "Música", precio: 10 },
];

// Función para agregar un producto al carrito
function agregarAlCarrito(carrito, producto) {
  carrito.push(producto);
  alert(`"${producto.nombre}" agregado al carrito.`);
}

// Función para calcular el precio total del carrito
function calcularTotal(carrito) {
  let total = 0;
  for (let producto of carrito) {
    total += producto.precio;
  }
  return total;
}

// Función para mostrar la lista de productos
function mostrarListaProductos() {
  let lista = "Lista de productos disponibles:\n";
  for (let producto of productos) {
    lista += `- ${producto.nombre} (${producto.categoria}): $${producto.precio}\n`;
  }
  alert(lista);
}

// Función para mostrar las categorías de productos
function mostrarCategorias() {
  let categorias = {};
  for (let producto of productos) {
    if (!(producto.categoria in categorias)) {
      categorias[producto.categoria] = [];
    }
    categorias[producto.categoria].push(producto);
  }
  let lista = "Categorías de productos disponibles:\n";
  for (let categoria in categorias) {
    lista += `- ${categoria}:\n`;
    for (let producto of categorias[categoria]) {
      lista += `  - ${producto.nombre}: $${producto.precio}\n`;
    }
  }
  alert(lista);
}

// Función para buscar un producto por nombre
function buscarProductoPorNombre(nombre) {
  return productos.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase());
}

// Función para mostrar los productos de una categoría
function mostrarProductosPorCategoria() {
  let categoria = prompt("Ingrese el nombre de la categoría que desea ver:");
  let productosCategoria = productos.filter(producto => producto.categoria.toLowerCase() === categoria.toLowerCase());
  if (productosCategoria.length > 0) {
    let listaProductos = `Productos en la categoría ${categoria}:\n`;
    for (let producto of productosCategoria) {
      listaProductos += `- ${producto.nombre}: $${producto.precio}\n`;
    }
    alert(listaProductos);
  } else {
    alert(`No se encontraron productos en la categoría "${categoria}".`);
  }
}



// Función principal para ejecutar el programa
function ejecutarPrograma() {
  let carrito = [];
  let opcion;
  do {
    opcion = prompt(`Ingrese una opción:
      1 - Agregar producto
      2 - Ver categorías de productos
      3 - Buscar producto por nombre
      4 - Buscar productos por categoría
      5 - Ver carrito
      6 - Salir`);
    switch (opcion) {
      case "1":
        mostrarListaProductos();
        let nombreProducto = prompt(
          "Ingrese el nombre del producto que desea agregar:"
        );
        let producto = buscarProductoPorNombre(nombreProducto);
        if (producto) {
          agregarAlCarrito(carrito, producto);
        } else {
          alert(`No se encontró el producto "${nombreProducto}".`);
        }
        break;
      case "2":
        mostrarCategorias();
        break;
      case "3":
        let nombreBusqueda = prompt(
          "Ingrese el nombre del producto que desea buscar:"
        );
        let productoBusqueda = buscarProductoPorNombre(nombreBusqueda);
        if (productoBusqueda) {
          alert(
            `Producto encontrado:\n${productoBusqueda.nombre} (${productoBusqueda.categoria}): $${productoBusqueda.precio}`
          );
        } else {
          alert(`No se encontró el producto "${nombreBusqueda}".`);
        }
        break;
      case "4":
        mostrarProductosPorCategoria();
        break;
      case "5":
        let carritoLista = "Carrito:\n";
        for (let producto of carrito) {
          carritoLista += `- ${producto.nombre}: $${producto.precio}\n`;
        }
        let total = calcularTotal(carrito);
        carritoLista += `Total: $${total}`;
        alert(carritoLista);
        break;
      case "6":
        alert("¡Hasta luego!");
        break;
      default:
        alert("Opción inválida. Intente de nuevo.");
        break;
    }
  } while (opcion !== "6");
}

// Ejecutar el programa
ejecutarPrograma();
