import { useState, useEffect } from "react";
import {
  Typography, Grid, Card, CardContent, CardActions, Button, Box, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import OpacityIcon from '@mui/icons-material/Opacity';
import { ethers } from "ethers";

// Paleta Bancolombia
const amarillo = "#FFD204";
const verde = "#00C587";
const naranja = "#FF803A";
const azul = "#01CDEB";
const negro = "#2C2A29";
const blanco = "#F7F7F7";
const grisTexto = "#444";

function safeBase64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function encodePayment(payment) {
  const safe = {
    ...payment,
    payload: {
      ...payment.payload,
      authorization: Object.fromEntries(
        Object.entries(payment.payload.authorization).map(([key, value]) => [
          key,
          typeof value === "bigint" ? value.toString() : value,
        ]),
      ),
    },
  };
  return safeBase64Encode(JSON.stringify(safe));
}

// Icono según producto
function getProductIcon(id) {
  if (id === "coffee") return <LocalCafeIcon sx={{ fontSize: 56, color: azul }} />;
  if (id === "snack") return <FastfoodIcon sx={{ fontSize: 56, color: naranja }} />;
  if (id === "water") return <OpacityIcon sx={{ fontSize: 56, color: verde }} />;
  return <ShoppingCartIcon sx={{ fontSize: 56, color: azul }} />;
}

const MarketPlace = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4021/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const handleBuy = async (item) => {
    try {
      const response = await fetch(`http://localhost:4021/buy/${item.id}`, { method: "POST" });
      if (response.status === 402) {
        const paymentParams = await response.json();
        const accept = paymentParams.accepts && paymentParams.accepts[0];
        if (!accept) {
          alert("No se recibieron los parámetros de pago correctamente.");
          return;
        }
        const domain = {
          name: accept.extra?.name || "USD Coin",
          version: accept.extra?.version || "2",
          chainId: Number(accept.extra?.chainId || 84532),
          verifyingContract: accept.asset
        };
        const types = {
          TransferWithAuthorization: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "validAfter", type: "uint256" },
            { name: "validBefore", type: "uint256" },
            { name: "nonce", type: "bytes32" }
          ]
        };
        const from = await window.ethereum.request({ method: "eth_requestAccounts" }).then(a => a[0]);
        const to = accept.payTo;
        const value = accept.maxAmountRequired;
        const validAfter = "0";
        const validBefore = (Math.floor(Date.now() / 1000) + 3600).toString();
        const nonce = window.crypto.getRandomValues(new Uint8Array(32)).reduce((str, b) => str + b.toString(16).padStart(2, '0'), '0x');
        const message = {
          from: String(from),
          to: String(to),
          value: String(value),
          validAfter: String(validAfter),
          validBefore: String(validBefore),
          nonce: String(nonce)
        };
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signature = await signer.signTypedData(domain, types, message);
        const payment = encodePayment({
          x402Version: 1,
          scheme: accept.scheme,
          network: accept.network,
          payload: {
            signature,
            authorization: message
          }
        });
        const payResponse = await fetch(`http://localhost:4021/buy/${item.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-PAYMENT": payment
          }
        });
        if (!payResponse.ok) {
          const error = await payResponse.text();
          throw new Error("Error del backend: " + error);
        }
        const data = await payResponse.json();
        alert(data.message || "¡Compra realizada!");
      } else {
        const data = await response.json();
        alert(data.message || "¡Compra realizada!");
      }
    } catch (error) {
      console.error("Error al comprar:", error);
      alert("No se pudo completar la operación.");
    }
  };

  const handleDetailOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleDetailClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: blanco
      }}
    >
      {/* Header integrado al fondo gris, sin caja */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: 2.5, // Espacio superior reducido a la mitad
          mb: 6,
          px: { xs: 2, md: 6 },
          py: 4,
          textAlign: "center"
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, color: negro }}>
          Tienda x402
        </Typography>
        <Typography variant="h6" sx={{ color: grisTexto, mt: 1 }}>
          ¡Compra productos digitales con pagos pequeños y seguros!
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {products.map(item => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                background: "#fff",
                border: `1.5px solid ${blanco}`,
                minHeight: 320,
                maxWidth: 320,
                mx: "auto",
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: `0 8px 32px 0 ${azul}22`
                }
              }}
            >
              <Box sx={{
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#fff"
              }}>
                {getProductIcon(item.id)}
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700, color: negro }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: verde }}>
                  {item.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: amarillo,
                    color: negro,
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 3,
                    boxShadow: "0 2px 8px 0 #FFD20433",
                    '&:hover': { background: verde, color: "#fff" }
                  }}
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleBuy(item)}
                >
                  Comprar
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: azul,
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 3,
                    px: 2,
                    textTransform: "none",
                    minWidth: 0,
                    '&:hover': {
                      color: verde,
                      background: "transparent",
                      textDecoration: "underline"
                    }
                  }}
                  onClick={() => handleDetailOpen(item)}
                >
                  Ver detalle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleDetailClose}>
        <DialogTitle sx={{ color: azul, fontWeight: 700 }}>Detalle del producto</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                {getProductIcon(selectedItem.id)}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: negro }}>
                {selectedItem.name}
              </Typography>
              <DialogContentText sx={{ mb: 2, color: grisTexto }}>
                {selectedItem.description}
              </DialogContentText>
              <Typography variant="h6" sx={{ fontWeight: 700, color: verde }}>
                {selectedItem.price}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} sx={{ color: azul, fontWeight: 700 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketPlace;