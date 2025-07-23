import axios from "axios";
import { config } from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import readline from "readline";

config();

const privateKey = process.env.PRIVATE_KEY as Hex;
const baseURL = process.env.RESOURCE_SERVER_URL as string; // Ej: http://localhost:4021

if (!baseURL || !privateKey) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);

const api = withPaymentInterceptor(
  axios.create({
    baseURL,
  }),
  account,
);

async function main() {
  // 1. Listar productos
  const { data: products } = await api.get("/products");
  console.log("Productos disponibles:");
  products.forEach((p: any, i: number) => {
    console.log(`${i + 1}. ${p.name} (${p.id}) - ${p.price} - ${p.description}`);
  });

  // 2. Seleccionar producto por número
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("¿Qué producto quieres comprar? (número): ", async (num) => {
    const idx = parseInt(num) - 1;
    const product = products[idx];
    if (!product) {
      console.log("Selección inválida.");
      rl.close();
      return;
    }

    try {
      // 3. Intentar comprar (POST /buy/:id)
      const response = await api.post(`/buy/${product.id}`);
      console.log(response.data);

      // Si el backend responde con x-payment-response, decodifica y muestra info
      if (response.headers["x-payment-response"]) {
        const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
        console.log("x-payment-response:", paymentResponse);
      }
    } catch (error: any) {
      console.error(error.response?.data?.error || error.message);
    }
    rl.close();
  });
}

main();
