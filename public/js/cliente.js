const cartItems = document.getElementById("cart-items");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const menuItem = button.closest(".name-price");
    const dishName = menuItem.querySelector("h3").textContent;
    const dishPrice = parseInt(
      menuItem.querySelector("p").textContent.slice(1)
    );

    // Agregar el plato al carrito (visualmente)
    const cartItem = document.createElement("li");
    const cartItemName = cartItem.appendChild(document.createElement("h3"))
    const cartItemPrice = cartItem.appendChild(document.createElement("p"));
    cartItemName.textContent = dishName;
    cartItemPrice.textContent = `$${dishPrice}`;
    cartItems.appendChild(cartItem);

    // Enviar información del plato al backend (vía AJAX o Fetch)
    axios
      .post("/api/add-to-cart", { dishName: dishName, dishPrice: dishPrice })
      .then((data) => {
        console.log(dishName)
        console.log(dishPrice)
        console.log("Plato agregado al carrito en el backend:", data);
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
  });
});

// Manejar el envío del pedido
document.getElementById("submit-order").addEventListener("click", () => {
  // Enviar el pedido completo al backend
  // ...
});
