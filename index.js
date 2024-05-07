import express from "express";
import bodyParser from "body-parser";
import * as fs from "fs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readFile("favorite.json", "utf-8", (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    const menu = jsonData[0];
    const favorite = menu.favoritos;
    const drinks = menu.drinks;
    res.render("index.ejs", { favorite: favorite, drinks: drinks });
  });
});

app.post('/api/add-to-cart', (req, res) => {
    const dishName = req.body.dishName;
    res.json({message: "Plato agregado al carrito"})
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
