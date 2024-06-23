// Elementos del DOM
const cartItems = document.getElementById("cart-items"); // Toma el elemento "ul" con el id "cart-items"
const addToCartButtons = document.querySelectorAll(".add-to-cart"); // Toma el query de todos los botones con la clase "add-to-cart"
const deleteItemButtons = document.querySelectorAll(".delete-item");

// Variables
let listItems = [];
let contadorItems = {};

// Función para obtener el pedido total al backend
async function getPedidoTotal() {
  try {
    const response = await axios.get("http://localhost:3000/pedidoTotal");
    const pedidoTotal = response.data;
    return pedidoTotal;
  } catch (error) {
    console.error(error);
  }
}

// Obtener el pedido total del backend
getPedidoTotal()
  .then((result) => {
    console.log(result);
    result.forEach((item) => {
      listItems.push(item);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Función para calcular la cantidad de cada producto en el pedido
function calcularCantidadPedido(pedido) {
  let contadorItems = {};
  pedido.forEach((producto) => {
    if (contadorItems[producto.dishName]) {
      contadorItems[producto.dishName].cantidad++;
    } else {
      contadorItems[producto.dishName] = {
        dishPrice: producto.dishPrice,
        cantidad: 1,
      };
    }
  });
  return contadorItems;
}

// Agregar event listener a los botones "Agregar al carrito"
addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Obtenemos informacion del producto seleccionado
    const menuItem = button.closest(".name-price");
    const dishName = menuItem.querySelector("h3").textContent;
    const dishPrice = parseInt(
      menuItem.querySelector("p").textContent.slice(1)
    );
    const dishCantidad = menuItem.querySelector("input").value;
    console.log(dishCantidad);

    // Agregamos el producto al pedido
    for (let index = 0; index < dishCantidad; index++) {
      listItems.push({ dishName, dishPrice });
    }

    // Calcular la cantidad de cada productos en el pedido
    contadorItems = calcularCantidadPedido(listItems);

    // Agregar el producto al carrito (visualmente)
    for (const key in contadorItems) {
      console.log(key);
      if (key === dishName && !document.getElementById(`${key}`)) {
        console.log("hola");
        const cartItem = document.createElement("li");

        const cartItemName = cartItem.appendChild(document.createElement("h3"));
        cartItemName.setAttribute("id", `${key}`);

        const cartItemPrice = cartItem.appendChild(document.createElement("p"));
        cartItemPrice.setAttribute("id", `${key}-price`);
        cartItemName.textContent = `${key} x ${contadorItems[key].cantidad}`;

        const cartItemButtonDelete = cartItem.appendChild(
          document.createElement("button")
        );
        cartItemButtonDelete.setAttribute("class", "delete-item");

        const imageButtonDelete = cartItemButtonDelete.appendChild(
          document.createElement("img")
        );
        imageButtonDelete.setAttribute("src", "/images/borrar.png");

        const priceTotal =
          contadorItems[key].dishPrice * contadorItems[key].cantidad;
        cartItemPrice.textContent = `$${priceTotal}`;
        cartItems.appendChild(cartItem);

        // Agregar evento de click al boton de eliminar

        cartItemButtonDelete.addEventListener("click", () => {
          const buttonElements = cartItemButtonDelete.closest("li");
          console.log(buttonElements);
          const elementSelected = buttonElements.querySelector("h3").id;
          console.log(elementSelected);

          contadorItems[elementSelected].cantidad--;

          if (contadorItems[elementSelected].cantidad === 0) {
            buttonElements.remove();
          } else {
            const cartItemName = document.getElementById(`${elementSelected}`);
            cartItemName.textContent = `${elementSelected} x ${contadorItems[elementSelected].cantidad}`;

            const cartItemPrice = document.getElementById(
              `${elementSelected}-price`
            );
            const priceTotal =
              contadorItems[elementSelected].dishPrice *
              contadorItems[elementSelected].cantidad;
            cartItemPrice.textContent = `$${priceTotal}`;
          }

          for (let i = 0; i <= listItems.length; i++) {
            if (listItems[i].dishName === elementSelected) {
              listItems.splice(i, 1);
              break;
            }
          }

          axios
            .post("/api/deleteItem", { itemSelected: elementSelected })
            .then((data) => {
              console.log("Plato agregado al carrito en el backend:", data);
            })
            .catch((error) => {
              console.error("Error al agregar al carrito:", error);
            });
        });
      } else if (contadorItems[key].cantidad > 1) {
        // const cartItem = document.createElement("li");
        // const cartItemName = cartItem.appendChild(document.createElement("h3"))
        // const cartItemPrice = cartItem.appendChild(document.createElement("p"));
        const cartItemName = document.getElementById(`${key}`);
        cartItemName.textContent = `${key} x ${contadorItems[key].cantidad}`;

        const cartItemPrice = document.getElementById(`${key}-price`);
        const priceTotal =
          contadorItems[key].dishPrice * contadorItems[key].cantidad;
        cartItemPrice.textContent = `$${priceTotal}`;
        //cartItems.appendChild(cartItem);
      }
    }

    // const cartItem = document.createElement("li");
    // const cartItemName = cartItem.appendChild(document.createElement("h3"))
    // const cartItemPrice = cartItem.appendChild(document.createElement("p"));
    // cartItemName.textContent = `${dishName} x ${contadorItems[key]}`;
    // cartItemPrice.textContent = `$${dishPrice}`;
    // cartItems.appendChild(cartItem);

    // Enviar información del plato al backend
    axios
      .post("/api/add-to-cart", {
        dishName: dishName,
        dishPrice: dishPrice,
        dishCantidad: dishCantidad,
      })
      .then((data) => {
        console.log("Plato agregado al carrito en el backend:", data);
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
  });
});

// Manejar el envío del pedido
document.getElementById("submit-order").addEventListener("click", () => {
  // Restablecer la lista de artículos y el objeto contadorItems
  listItems = [];
  contadorItems = {};
});

deleteItemButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonElements = button.closest("li");
    console.log(buttonElements);
    const elementSelected = buttonElements.querySelector("h3").id;
    console.log(elementSelected);

    contadorItems = calcularCantidadPedido(listItems);
    console.log(contadorItems);

    contadorItems[elementSelected].cantidad--;

    if (contadorItems[elementSelected].cantidad === 0) {
      buttonElements.remove();
    } else {
      const cartItemName = document.getElementById(`${elementSelected}`);
      cartItemName.textContent = `${elementSelected} x ${contadorItems[elementSelected].cantidad}`;

      const cartItemPrice = document.getElementById(`${elementSelected}-price`);
      const priceTotal =
        contadorItems[elementSelected].dishPrice *
        contadorItems[elementSelected].cantidad;
      cartItemPrice.textContent = `$${priceTotal}`;
    }

    for (let i = 0; i <= listItems.length; i++) {
      if (listItems[i].dishName === elementSelected) {
        listItems.splice(i, 1);
        break;
      }
    }

    axios
      .post("/api/deleteItem", { itemSelected: elementSelected })
      .then((data) => {
        console.log("Plato agregado al carrito en el backend:", data);
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
  });
});
