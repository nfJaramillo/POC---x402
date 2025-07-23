import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { paymentMiddleware, Resource } from "x402-express";
config();

const facilitatorUrl = process.env.FACILITATOR_URL as Resource;
const payTo = process.env.ADDRESS as `0x${string}`;

if (!facilitatorUrl || !payTo) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

const products = [
  { id: "coffee", name: "Café", price: "$0.02", description: "Café caliente pequeño" },
  { id: "snack", name: "Snack", price: "$0.01", description: "Barra de cereal" },
  { id: "water", name: "Agua", price: "$0.01", description: "Botella de agua 500ml" },
];

// Endpoint para listar productos
app.get("/products", (req, res) => {
  res.json(products);
});

// Lógica de precios para x402
const x402Resources: Record<string, { price: string; network: "base-sepolia" | "base" }> = {};
products.forEach(product => {
  x402Resources[`POST /buy/${product.id}`] = {
    price: product.price,
    network: "base-sepolia",
  };
});

app.use(
  paymentMiddleware(
    payTo,
    x402Resources,
    {
      url: facilitatorUrl,
    },
  ),
);

// Endpoint de compra (requiere pago x402)
app.post("/buy/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: `¡Compraste ${product.name} por ${product.price}!` });
});

app.listen(4021, () => {
  console.log(`Server listening at http://localhost:4021`);
});

