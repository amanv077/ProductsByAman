import bodyParser from "body-parser";
import express, { Response, Request } from "express";
import { v4 as uuidV4 } from "uuid";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
}

let products: Product[] = [
  { id: "1", name: "Product 1", price: 20, category: "Category 1" },
  { id: "2", name: "Product 2", price: 10, category: "Category 1" },
  { id: "3", name: "Product 3", price: 100, category: "Category 2" },
  { id: "4", name: "Product 4", price: 200, category: "Category 1" },
]; // Database;

app.post("/products", (req: Request, res: Response): void => {
  const { name, price, category } = req.body;
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "Name is required and must be a string" });
    return;
  }

  if (!price || typeof price !== "number") {
    res.status(400).json({ error: "Price is required and must be a number" });
    return;
  }

  if (!category || typeof category !== "string") {
    res
      .status(400)
      .json({ error: "Category is required and must be a string" });
    return;
  }

  const newProduct: Product = {
    id: uuidV4(),
    name,
    price,
    category,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get("/products", (_req: Request, res: Response): void => {
  res.json(products);
  return;
});

app.get("/products/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }

  res.json(product);
});

app.delete("/products/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    res.status(404).json({ error: "Product not found." });
    return;
  }
  const [product] = products.splice(productIndex, 1);
  res.status(204).send(product);
});

app.put("/products/:id", (req: Request, res: Response): void => {
  const product = products.find((p) => p.id === req.params.id);
  console.log(product, req.params);
  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }

  const { name, price, category } = req.body;
  if (name && typeof name !== "string") {
    res.status(400).json({ error: "Name must be a string" });
    return;
  }
  if (price && typeof price !== "number") {
    res.status(400).json({ error: "Price must be a number" });
    return;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (category) product.category = category;
  res.json(product);
  return;
});

app.listen(PORT, () => {
  console.log(`Product Management Service is running on PORT ${PORT}`);
});
