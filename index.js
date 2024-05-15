import express from "express";
import bodyParser from "body-parser";
import * as fs from "fs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Lectura de JSON con el menu
async function readJson() {
  try {
    const data = await fs.promises.readFile("favorite.json", "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData[0];
  } catch (error) {
    console.error(err);
    throw err;
  }
}

// Lista de pedidos vacio
let pedido = [];
let pedidoAgrupados = {};

// Lectura de JSON para el menú
const menu = await readJson();

// Selección de los platos del menu
let menuSelected = menu.favoritos;


app.get("/", async (req, res) => {
  //console.log(menuSelected);
  //const drinks = menu.drinks;
  res.render("index.ejs", { menu: menuSelected, pedido: pedido });
});

app.post("/menu", async (req, res) => {
  const input = req.body.menu;
  const menu = await readJson();
  console.log(input)
  console.log(menu.drinks)
  if (input === "Bebestibles") {
    menuSelected = menu.drinks;
  } else {
    menuSelected = menu.favoritos;
  }
  res.redirect("/");
});

app.post("/api/add-to-cart", (req, res) => {
  const dishInfo = req.body; // Tengo que usar dishInfo para leer los datos
  //pedido.push(dishInfo);
  //console.log(pedido);
  pedido.forEach((producto) => {
    console.log(pedido);
    if (pedidoAgrupados[producto.dishName]) {
      pedidoAgrupados[producto.dishName].cantidad++;
    } else {
      pedidoAgrupados[producto.dishName] = {
        dishName: producto.dishName,
        dishPrice: producto.dishPrice,
        cantidad: 1
      };
    };
  });
  //console.log(pedido);
  console.log(pedidoAgrupados);
  res.json({ message: "Plato agregado al carrito" });
});

app.post("/submit-order", (req, res) => {
  pedido = [];
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
