const express = require("express");
const path = require("path");
const ProductManager = require("./ProductManager.js");
const CartManager = require("./CartManager.js");
const app = express();
const PORT = 8080;

app.use(express.json());

const filePath = path.join(__dirname, "src", "data", "products.json");
const productManager = new ProductManager(filePath);
const cartFilePath = path.join(__dirname, "src", "data", "carts.json");
const cartManager = new CartManager(cartFilePath);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/products", async (req, res) => {
  const product = await productManager.getProducts();
  res.status(200).send(product);
});

app.get("/products/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await productManager.getProductById(pid);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

app.post("/products", async (req, res) => {
  const { title, description, price, thumbnails, code, category, stock } =
    req.body;
  if (
    !title ||
    !description ||
    !price ||
    !thumbnails ||
    !code ||
    !category ||
    !stock
  ) {
    return res.status(400).send({ error: "Faltan campos obligatorios" });
  }
  try {
    const newProduct = await productManager.addProduct({
      title,
      description,
      price,
      thumbnails,
      code,
      category,
      stock,
    });
    res.status(201).send(newProduct);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send({error: "Error interno al crear el producto"})
  }
});

app.put("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, thumbnails, code, category, stock } =
    req.body;
  const products = await productManager.getProducts();
  const product = products.find((p) => p.id === parseInt(pid));
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  try {
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.thumbnails = thumbnails || product.thumbnails;
    product.code = code || product.code;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    await productManager.saveProducts(products);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error al realizar el cambio:", error);
  }
});

app.delete("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const products = await productManager.getProducts();
  filteredProducts = products.filter((p) => p.id !== parseInt(pid));
  await productManager.saveProducts(filteredProducts);
  res.status(200).json({ message: "Producto eliminado correctamente" });
});

//CART

app.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({error: "Error interno al crear el carrito"});
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    } else {
      res.status(200).json(cart);
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await productManager.getProductById(parseInt(pid));
    if (!product) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado, intenta nuevamente" });
    }
    const updatedCart = await cartManager.addProductToCart(cid, parseInt(pid));
    if (!updatedCart) {
      return res
        .status(404)
        .json({ error: "Carrito no encontrado, intenta nuevamente" });
    } else {
      res.status(200).json(updatedCart);
    }
  } catch (error) {
    console.error("error al agregar producto al carrito:", error);
    res.status(500).json({error: "Error interno al agregar producto al carrito"})
  }
});

app.listen(PORT, () => {
  console.log(`servidor corriendo en el puerto http://localhost:${PORT}`);
});
