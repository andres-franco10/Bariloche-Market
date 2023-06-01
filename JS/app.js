/*leer los datos usando AJAX, utilizando FETCH con asincronismo. poner controles de errores, TRY y CATCH */

async function loadData() {
  try {
    const response = await fetch(
      "/JSON/data.json"
    ); /* Crear ARRAY de productos. o Un Objetos o varios Objetos en archivo JSON*/
    if (!response.ok) {
      throw new Error("No se pudo cargar el archivo de productos.");
    }
    const data = await response.json();
    const productos = data.productos;

    //creo el buscador de productos

    const cardContainer = document.getElementById("cardContainer");
    const searchInput = document.getElementById("searchInput");
    let productoBuscado = [];

    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      productoBuscado.forEach((producto) => {
        const esVisible =
          producto.nombre.toLowerCase().includes(value) ||
          producto.categoria.toLowerCase().includes(value);
        producto.element.classList.toggle("hide", !esVisible);
      });
    });

    // creo las cards de los productos y las mapeo.

    productoBuscado = productos.map((producto) => {
      const card = document.createElement("div");
      card.classList.add("col");

      card.innerHTML = `
       <div class="card"> 
            <div class="card-body card">  
                 <img src="${producto.imagen}" class="card-img-top" alt="...">
                <h2>${producto.nombre}</h2>    
                <p class="card-text">${producto.descripcion}</p>
                <span>$${producto.precio}</span>
                <button type="button" class="btn btn-success agregarAlCarrito" data-nombre=" ${producto.nombre} "data-id="${producto.id}" data-precio ="${producto.precio}" >Agregar al carrito</button>
          </div>
        </div>
    `;

      cardContainer.appendChild(card);
      return {
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        element: card,
      };
    });

    // sumo la cantidad de cada producto en 1 si se clikea en agregar al carrito de nuevo
    const botonesAgregarAlCarrito =
      document.getElementsByClassName("agregarAlCarrito");

    for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
      const botonAgregarAlCarrito = botonesAgregarAlCarrito[i];

      botonAgregarAlCarrito.addEventListener("click", (e) => {
        const idProducto = e.target.getAttribute("data-id");
        const nombreProducto = e.target.getAttribute("data-nombre");
        const precioProducto = e.target.getAttribute("data-precio");

        actualizarCantidadCarrito(
          idProducto,
          nombreProducto,
          precioProducto,
          1
        );
        mostrarCarrito(); // Actualizar la ventana modal
        actualizarIconoCarrito();
        mostrarMensaje(nombreProducto);
      });
    }

    // CATCH
  } catch (error) {
    console.error(error);
  }
}
//creo el icono carrito en el html
window.addEventListener("load", function () {
  let botonCarrito = document.getElementById("botonIconoCarrito");
  let iconoCarrito = document.createElement("i");
  iconoCarrito.classList.add("fa", "badge", "fa-lg");
  iconoCarrito.innerHTML = "&#xf07a;";

  botonCarrito.appendChild(iconoCarrito);
  actualizarIconoCarrito();
});

// el numero del icono del carrito es igual al numero de productos que agrego. Pero no es igual a las cantidades de cada producto
function actualizarIconoCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};
  let cantidad = Object.keys(carrito).length;
  let iconoCarrito = document.querySelector("#botonIconoCarrito i");
  iconoCarrito.setAttribute("value", cantidad);
  iconoCarrito.textContent = `&#xf07a;
  `;
  iconoCarrito.innerHTML = "&#xf07a;";
}

// cartel de ha sido agregado al carrito
function mostrarMensaje(nombreProducto) {
  const mensaje = document.createElement("div");
  mensaje.classList.add("mensaje");
  mensaje.textContent = `El producto ${nombreProducto} ha sido agregado al carrito`;

  document.body.appendChild(mensaje);

  setTimeout(() => {
    document.body.removeChild(mensaje);
  }, 2500);
}
//PERSISTO EL CArrito ene l localStorage
function actualizarCantidadCarrito(
  idProducto,
  nombreProducto,
  precioProducto,
  cantidad
) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};
  carrito[idProducto] = {
    nombre: nombreProducto,
    precio: precioProducto,
    cantidad: (carrito[idProducto]?.cantidad || 0) + cantidad,
  };
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar la cantidad en la ventana modal
  const productoContainer = document.getElementById(`producto-${idProducto}`);
  if (productoContainer) {
    const cantidadElement = productoContainer.querySelector(".cantidad");
    if (cantidadElement) {
      cantidadElement.textContent = carrito[idProducto].cantidad;
    }
  }
}

const mostrarCarrito = () => {
  const modalBody = document.querySelector(".modal .modal-body");
  modalBody.innerHTML = ""; // Limpiar contenido anterior

  const carrito = JSON.parse(localStorage.getItem("carrito"));
  const precioTotal = document.getElementById("precioTotal");
  precioTotal.classList.add("precio-total");
  let total = 0;

  if (Object.keys(carrito).length === 0) {
    // SI el carrito esta vacio muestro un mensaje
    const mensajeElement = document.createElement("p");
    mensajeElement.textContent = "¡Aún no has agregado productos al carrito!";
    mensajeElement.classList.add("text-center");
    mensajeElement.classList.add("text-primary");
    mensajeElement.classList.add("parrafo");

    modalBody.appendChild(mensajeElement);

    precioTotal.innerText = `$${0}`;
  } else {
    // Carrito no vacío, mostrar productos
    for (const key in carrito) {
      if (carrito.hasOwnProperty(key)) {
        const producto = carrito[key]; // Obtener cada producto individualmente

        const productoContainer = document.createElement("div");
        productoContainer.classList.add("modal-contenedor");
        productoContainer.id = `producto-${key}`;

        const nombreElement = document.createElement("p");
        nombreElement.textContent = producto.nombre;

        const precioElement = document.createElement("p");
        precioElement.textContent = `Precio: $${producto.precio}`;

        const cantidadElement = document.createElement("p");
        cantidadElement.innerHTML = `Cantidad: <span class="cantidad">${producto.cantidad}</span>`;

        const eliminarButton = document.createElement("button");
        eliminarButton.classList.add("btn", "btn-danger");
        eliminarButton.textContent = "Eliminar Producto";

        // Eliminar ese producto del carrito
        eliminarButton.addEventListener("click", () => {
          eliminarProducto(key); // Pasar el id como argumento
        });

        //calculo el precio total del carrito
        total += producto.cantidad * producto.precio;
        precioTotal.innerText = `$${total.toFixed(2)}`; //solo muestra 2 decimales

        productoContainer.appendChild(nombreElement);
        productoContainer.appendChild(precioElement);
        productoContainer.appendChild(cantidadElement);
        productoContainer.appendChild(eliminarButton);

        modalBody.appendChild(productoContainer);
      }
    }
  }
};

function eliminarProducto(idProducto) {
  let carrito = JSON.parse(localStorage.getItem("carrito"));

  // Elimina el producto del carrito usando el idProducto proporcionado
  delete carrito[idProducto];

  // Actualiza el carrito en el localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Vuelve a mostrar el carrito actualizado
  mostrarCarrito();
  actualizarIconoCarrito();
}

const vaciarCarrito = () => {
  // Elimina todos los productos del carrito
  const carrito = {};
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Vuelve a mostrar el carrito actualizado
  mostrarCarrito();
  actualizarIconoCarrito();
};
// Agrego el evento de click al botón "Vaciar carrito"
const vaciarCarritoButton = document.getElementById("vaciarCarrito");
vaciarCarritoButton.addEventListener("click", vaciarCarrito);

// Boton de FInalizar COmpra.
const procesarCompra = document.getElementById("procesarCompra");

procesarCompra.addEventListener("click", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito"));

  //Si no hay nada en el carrito muestro mensaje
  if (Object.keys(carrito).length === 0) {
    Swal.fire({
      title: "¡Tu carrito está vacio!",
      text: "Compra algo para continuar con la compra",
      icon: "error",
      confirmButtonText: "Aceptar",
    });

    //si hay algo en el carrito lo llevo a la pasarela de pago
  } else {
    location.href = "compra.html";
  }
});

window.addEventListener("load", function () {
  // ...
  actualizarIconoCarrito();
  mostrarCarrito();
});

loadData();
