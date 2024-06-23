// Importaciones
import express from "express";
import bodyParser from "body-parser";
import * as fs from "fs";
import pg from "pg";

// Constantes
const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "buggys",
  password: "sasa",
  port: 5432,
});

db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

//Funciones

async function readJsonMenu() {
  try {
    const data = await fs.promises.readFile("favorite.json", "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function readJsonPedidos() {
  try {
    const data = await fs.promises.readFile("pedidos.json", "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function calcularCantidadPedido(pedido) {
  let cantidadPedido = {};
  pedido.forEach((producto) => {
    if (cantidadPedido[producto.dishName]) {
      let cantidad = ++cantidadPedido[producto.dishName].cantidad;
      cantidadPedido[producto.dishName].dishPrice =
        cantidad * producto.dishPrice;
    } else {
      cantidadPedido[producto.dishName] = {
        dishPrice: producto.dishPrice,
        cantidad: 1,
      };
    }
  });
  return cantidadPedido;
}

// Variables globales
let pedido = [];
let cantidadPedido = {};
let contadorPedidos = 0;

// Lectura de JSONs
const menu = await readJsonMenu();
let dbPedidos = await readJsonPedidos();


// Menu seleccionado
let menuSelected = menu.favoritos;
let titleMenu = "Favoritos";

// Rutas
app.get("/", async (req, res) => {  
  res.render("index.ejs", {
    menu: menuSelected,
    pedido: cantidadPedido,
    title: titleMenu,
  });
});

app.get("/pedidoTotal", (req, res) => {
  const data = pedido;
  res.json(data);
});

app.get("/cajero", async (req, res) => {
  
  res.render("cajero.ejs", {
    pedidos: dbPedidos
  })
})

app.post("/api/deletePedido", (req, res) => {
  const idPedido = req.body.idPedido;

  dbPedidos.forEach((pedido) => {
    const index = dbPedidos.findIndex(pedido => pedido.id === idPedido);

    if (index != -1) {
      dbPedidos.splice(index, 1);
    }
  });

  fs.writeFileSync("pedidos.json", JSON.stringify(dbPedidos));
});

app.post("/menu", async (req, res) => {
  const input = req.body.menu;
  const menu = await readJsonMenu();
  if (input === "Bebestibles") {
    menuSelected = menu.drinks;
    titleMenu = input;
  } else {
    menuSelected = menu.favoritos;
    titleMenu = input;
  }
  res.redirect("/");
});

app.post("/api/add-to-cart", (req, res) => {
  const dishInfo = req.body;
  for (let index = 0; index < dishInfo.dishCantidad; index++) {
    pedido.push(dishInfo);
  }
  cantidadPedido = calcularCantidadPedido(pedido);
  console.log(cantidadPedido);
  res.json({ message: "Plato agregado al carrito" });
});

app.post("/submit-order", async (req, res) => {
  
  
  const numeroMesa = req.body.numeroMesa;
  const nombreCliente = req.body.nombreCliente;

  let montoTotal = 0;
  let cantidadPedido2 = {};

  for (const key in cantidadPedido) {
    montoTotal += cantidadPedido[key].dishPrice;
    cantidadPedido2[key] = cantidadPedido[key].cantidad;
  }

  try {

    const pedidoNuevo = {
      id: ++contadorPedidos,
      mesa: numeroMesa,
      nombre: nombreCliente,
      pedido: cantidadPedido2,
      monto: montoTotal
    };

    dbPedidos.push(pedidoNuevo);

    // console.log(pedidoNuevo)

    fs.writeFileSync("pedidos.json", JSON.stringify(dbPedidos));
    // await db.query(
    //   "INSERT INTO pedidos_realizados (mesa, cliente, pedido, monto_total) VALUES ($1, $2, $3, $4)",
    //   [numeroMesa, nombreCliente, cantidadPedido, montoTotal]);

    pedido = [];
    cantidadPedido = {};
    res.redirect("/");
  } catch (error) {
    console.error(error)
  }  
});

app.post("/api/deleteItem", (req, res) => {
  console.log(req.body.itemSelected);
  const itemSelected = req.body.itemSelected;

  console.log(pedido);
console.log("================================");
  console.log(cantidadPedido);

  for(let i = 0; i <= pedido.length; i++) {
    if (pedido[i].dishName === itemSelected) {
      pedido.splice(i, 1);
      break;
    }
  }
  
  if (cantidadPedido[itemSelected]) {
    console.log("ingreso aqui");
    console.log(cantidadPedido[itemSelected]);
    cantidadPedido[itemSelected].cantidad--
    console.log(cantidadPedido[itemSelected]);

    if (cantidadPedido[itemSelected].cantidad === 0) {
      delete cantidadPedido[itemSelected];
    }

  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
