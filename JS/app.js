/* Crear ARRAY de productos. o Un Objetos o varios Objetos en arvicho JSON*/


/*leer los datos usando AJAX, utilizando FETCH con asincronismo y promesas. poner controles de errores, TRY CATCH Y FINALLY */



async function loadData() {
  try {
    const response = await fetch("/JSON/data.json");
    if (!response.ok) {
      throw new Error("No se pudo cargar el archivo de productos.");
    }
    const data = await response.json();
    const productos = data.productos;


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

    // CATCH
  } catch (error) {
    console.error(error);
  }
  

// sumo la cantidad de cada producto en 1 si se clikea en agregar al carrito de nuevo
const botonesAgregarAlCarrito = document.getElementsByClassName("agregarAlCarrito");

for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
  const botonAgregarAlCarrito = botonesAgregarAlCarrito[i];

  botonAgregarAlCarrito.addEventListener("click", (e) => {
    const idProducto = e.target.getAttribute("data-id");
    const nombreProducto = e.target.getAttribute("data-nombre");
    const precioProducto = e.target.getAttribute("data-precio");

    actualizarCantidadCarrito(idProducto, nombreProducto, precioProducto, 1);
    mostrarCarrito(); // Actualizar la ventana modal
    actualizarIconoCarrito();
    mostrarMensaje(nombreProducto);
  });
}

}
//creo el icono carrito en el html
window.addEventListener('load', function() {
  let botonCarrito = document.getElementById("botonIconoCarrito");
  let iconoCarrito = document.createElement("i");
  iconoCarrito.classList.add("fa", "badge", "fa-lg");
  iconoCarrito.innerHTML ="&#xf07a;"
 

  botonCarrito.appendChild(iconoCarrito);
  actualizarIconoCarrito();

});



// el numero del icono del carrito es igual al numero de productos que agrego. Pero no es igual a las cantidades de cada producto
function actualizarIconoCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};
  let cantidad = Object.keys(carrito).length
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
function actualizarCantidadCarrito(idProducto, nombreProducto, precioProducto, cantidad) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};
  carrito[idProducto] = { nombre: nombreProducto, precio: precioProducto, cantidad: (carrito[idProducto]?.cantidad || 0) + cantidad };
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

  for (var key in carrito) {
    if (carrito.hasOwnProperty(key)) {
      const producto = carrito[key]; // Obtén el objeto producto individual

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

      productoContainer.appendChild(nombreElement);
      productoContainer.appendChild(precioElement);
      productoContainer.appendChild(cantidadElement);
      productoContainer.appendChild(eliminarButton);

      modalBody.appendChild(productoContainer);
    }
  }
}


loadData();

