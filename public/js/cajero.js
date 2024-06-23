// Elementos del DOM

const deleteItemButtons = document.querySelectorAll(".delete-item");

// Agregar eventos listener a los botones de los pedidos

deleteItemButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const infoPedidoElements = button.closest(".info-pedido");
    const idPedidoText = infoPedidoElements.querySelector(".id").textContent;
    const idPedido = parseInt(idPedidoText.slice(4));

    

    console.log(infoPedidoElements);
    infoPedidoElements.remove();

    axios
      .post("/api/deletePedido", { idPedido: idPedido })
      .then((data) => {
        console.log("Plato agregado al carrito en el backend:", data);
      })
      .catch((error) => {
        console.error("Error al eliminar pedido:", error);
      });
  });
});
