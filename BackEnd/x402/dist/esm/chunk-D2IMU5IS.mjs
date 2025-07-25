import {
  __export,
  config,
  getUsdcAddressForChain,
  usdcABI
} from "./chunk-BQ26ZGM7.mjs";

// src/types/shared/money.ts
import { z } from "zod";
var moneySchema = z.union([z.string().transform((x) => x.replace(/[^0-9.-]+/g, "")), z.number()]).pipe(z.coerce.number().min(1e-4).max(999999999));

// src/types/shared/network.ts
import { z as z2 } from "zod";
var NetworkSchema = z2.enum(["base-sepolia", "base"]);
var SupportedEVMNetworks = ["base-sepolia", "base"];
var EvmNetworkToChainId = /* @__PURE__ */ new Map([
  ["base-sepolia", 84532],
  ["base", 8453]
]);
var ChainIdToNetwork = Object.fromEntries(
  SupportedEVMNetworks.map((network) => [EvmNetworkToChainId.get(network), network])
);

// src/types/shared/evm/index.ts
var evm_exports = {};
__export(evm_exports, {
  authorizationPrimaryType: () => authorizationPrimaryType,
  authorizationTypes: () => authorizationTypes,
  config: () => config,
  createClientSepolia: () => createClientSepolia,
  createSignerSepolia: () => createSignerSepolia,
  isAccount: () => isAccount,
  isSignerWallet: () => isSignerWallet,
  usdcABI: () => usdcABI
});

// src/types/shared/evm/eip3009.ts
var authorizationTypes = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" }
  ]
};
var authorizationPrimaryType = "TransferWithAuthorization";

// src/types/shared/evm/wallet.ts
import { createPublicClient, createWalletClient, http, publicActions } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
function createClientSepolia() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http()
  }).extend(publicActions);
}
function createSignerSepolia(privateKey) {
  return createWalletClient({
    chain: baseSepolia,
    transport: http(),
    account: privateKeyToAccount(privateKey)
  }).extend(publicActions);
}
function isSignerWallet(wallet) {
  return "chain" in wallet && "transport" in wallet;
}
function isAccount(wallet) {
  return "address" in wallet && "type" in wallet;
}

// src/types/verify/x402Specs.ts
import { z as z3 } from "zod";
var EvmMaxAtomicUnits = 18;
var EvmAddressRegex = /^0x[0-9a-fA-F]{40}$/;
var MixedAddressRegex = /^0x[a-fA-F0-9]{40}|[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$/;
var HexEncoded64ByteRegex = /^0x[0-9a-fA-F]{64}$/;
var EvmSignatureRegex = /^0x[0-9a-fA-F]{130}$/;
var schemes = ["exact"];
var x402Versions = [1];
var ErrorReasons = ["insufficient_funds", "invalid_scheme", "invalid_network"];
var isInteger = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;
var hasMaxLength = (maxLength) => (value) => value.length <= maxLength;
var PaymentRequirementsSchema = z3.object({
  scheme: z3.enum(schemes),
  network: NetworkSchema,
  maxAmountRequired: z3.string().refine(isInteger),
  resource: z3.string().url(),
  description: z3.string(),
  mimeType: z3.string(),
  outputSchema: z3.record(z3.any()).optional(),
  payTo: z3.string().regex(MixedAddressRegex),
  maxTimeoutSeconds: z3.number().int(),
  asset: z3.string().regex(MixedAddressRegex),
  extra: z3.record(z3.any()).optional()
});
var ExactEvmPayloadAuthorizationSchema = z3.object({
  from: z3.string().regex(EvmAddressRegex),
  to: z3.string().regex(EvmAddressRegex),
  value: z3.string().refine(isInteger).refine(hasMaxLength(EvmMaxAtomicUnits)),
  validAfter: z3.string().refine(isInteger),
  validBefore: z3.string().refine(isInteger),
  nonce: z3.string().regex(HexEncoded64ByteRegex)
});
var ExactEvmPayloadSchema = z3.object({
  signature: z3.string().regex(EvmSignatureRegex),
  authorization: ExactEvmPayloadAuthorizationSchema
});
var PaymentPayloadSchema = z3.object({
  x402Version: z3.number().refine((val) => x402Versions.includes(val)),
  scheme: z3.enum(schemes),
  network: NetworkSchema,
  payload: ExactEvmPayloadSchema
});
var VerifyResponseSchema = z3.object({
  isValid: z3.boolean(),
  invalidReason: z3.enum(ErrorReasons).optional(),
  payer: z3.string().regex(MixedAddressRegex).optional()
});
var SettleResponseSchema = z3.object({
  success: z3.boolean(),
  errorReason: z3.enum(ErrorReasons).optional(),
  payer: z3.string().regex(MixedAddressRegex).optional(),
  transaction: z3.string().regex(MixedAddressRegex),
  network: NetworkSchema
});
var SupportedPaymentKindSchema = z3.object({
  x402Version: z3.number().refine((val) => x402Versions.includes(val)),
  scheme: z3.enum(schemes),
  network: NetworkSchema
});
var SupportedPaymentKindsResponseSchema = z3.object({
  kinds: z3.array(SupportedPaymentKindSchema)
});

// src/types/verify/facilitator.ts
import { z as z4 } from "zod";

// src/shared/json.ts
function toJsonSafe(data) {
  if (typeof data !== "object") {
    throw new Error("Data is not an object");
  }
  function convert(value) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, convert(val)]));
    }
    if (Array.isArray(value)) {
      return value.map(convert);
    }
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  }
  return convert(data);
}

// src/schemes/exact/evm/sign.ts
import { getRandomValues } from "crypto";
import { toHex } from "viem";
async function signAuthorization(walletClient, { from, to, value, validAfter, validBefore, nonce }, { asset, network, extra }) {
  const chainId = getNetworkId(network);
  const name = extra == null ? void 0 : extra.name;
  const version2 = extra == null ? void 0 : extra.version;
  const account = isSignerWallet(walletClient) ? walletClient.account : walletClient;
  const data = {
    account,
    types: authorizationTypes,
    domain: {
      name,
      version: version2,
      chainId,
      verifyingContract: asset
    },
    primaryType: "TransferWithAuthorization",
    message: {
      from,
      to,
      value,
      validAfter,
      validBefore,
      nonce
    }
  };
  if (isSignerWallet(walletClient)) {
    const signature = await walletClient.signTypedData(data);
    return {
      signature
    };
  } else if (isAccount(walletClient) && walletClient.signTypedData) {
    const signature = await walletClient.signTypedData(data);
    return {
      signature
    };
  } else {
    throw new Error("Invalid wallet client provided does not support signTypedData");
  }
}
function createNonce() {
  return toHex(getRandomValues(new Uint8Array(32)));
}

// src/schemes/exact/evm/utils/paymentUtils.ts
function encodePayment(payment) {
  const safe = {
    ...payment,
    payload: {
      ...payment.payload,
      authorization: Object.fromEntries(
        Object.entries(payment.payload.authorization).map(([key, value]) => [
          key,
          typeof value === "bigint" ? value.toString() : value
        ])
      )
    }
  };
  return safeBase64Encode(JSON.stringify(safe));
}
function decodePayment(payment) {
  const decoded = safeBase64Decode(payment);
  const parsed = JSON.parse(decoded);
  const obj = {
    ...parsed,
    payload: {
      signature: parsed.payload.signature,
      authorization: {
        ...parsed.payload.authorization,
        value: parsed.payload.authorization.value,
        validAfter: parsed.payload.authorization.validAfter,
        validBefore: parsed.payload.authorization.validBefore
      }
    }
  };
  const validated = PaymentPayloadSchema.parse(obj);
  return validated;
}

// src/schemes/exact/evm/client.ts
function preparePaymentHeader(from, x402Version, paymentRequirements) {
  const nonce = createNonce();
  const validAfter = BigInt(
    Math.floor(Date.now() / 1e3) - 60
    // 60 seconds before
  ).toString();
  const validBefore = BigInt(
    Math.floor(Date.now() / 1e3 + paymentRequirements.maxTimeoutSeconds)
  ).toString();
  return {
    x402Version,
    scheme: paymentRequirements.scheme,
    network: paymentRequirements.network,
    payload: {
      signature: void 0,
      authorization: {
        from,
        to: paymentRequirements.payTo,
        value: paymentRequirements.maxAmountRequired,
        validAfter: validAfter.toString(),
        validBefore: validBefore.toString(),
        nonce
      }
    }
  };
}
async function signPaymentHeader(client, paymentRequirements, unsignedPaymentHeader) {
  const { signature } = await signAuthorization(
    client,
    unsignedPaymentHeader.payload.authorization,
    paymentRequirements
  );
  return {
    ...unsignedPaymentHeader,
    payload: {
      ...unsignedPaymentHeader.payload,
      signature
    }
  };
}
async function createPayment(client, x402Version, paymentRequirements) {
  const from = isSignerWallet(client) ? client.account.address : client.address;
  const unsignedPaymentHeader = preparePaymentHeader(from, x402Version, paymentRequirements);
  return signPaymentHeader(client, paymentRequirements, unsignedPaymentHeader);
}
async function createPaymentHeader(client, x402Version, paymentRequirements) {
  const payment = await createPayment(client, x402Version, paymentRequirements);
  return encodePayment(payment);
}

// src/client/createPaymentHeader.ts
async function createPaymentHeader2(client, x402Version, paymentRequirements) {
  if (paymentRequirements.scheme === "exact" && SupportedEVMNetworks.includes(paymentRequirements.network)) {
    return await createPaymentHeader(client, x402Version, paymentRequirements);
  }
  throw new Error("Unsupported scheme");
}

// src/client/preparePaymentHeader.ts
function preparePaymentHeader2(from, x402Version, paymentRequirements) {
  if (paymentRequirements.scheme === "exact" && SupportedEVMNetworks.includes(paymentRequirements.network)) {
    return preparePaymentHeader(from, x402Version, paymentRequirements);
  }
  throw new Error("Unsupported scheme");
}

// src/shared/network.ts
function getNetworkId(network) {
  if (EvmNetworkToChainId.has(network)) {
    return EvmNetworkToChainId.get(network);
  }
  throw new Error(`Unsupported network: ${network}`);
}

// src/client/selectPaymentRequirements.ts
function selectPaymentRequirements(paymentRequirements, network, scheme) {
  paymentRequirements.sort((a, b) => {
    if (a.network === "base" && b.network !== "base") {
      return -1;
    }
    if (a.network !== "base" && b.network === "base") {
      return 1;
    }
    return 0;
  });
  const broadlyAcceptedPaymentRequirements = paymentRequirements.filter((requirement) => {
    const isExpectedScheme = !scheme || requirement.scheme === scheme;
    const isExpectedChain = !network || network == requirement.network;
    return isExpectedScheme && isExpectedChain;
  });
  const usdcRequirements = broadlyAcceptedPaymentRequirements.filter((requirement) => {
    return requirement.asset === getUsdcAddressForChain(getNetworkId(requirement.network));
  });
  if (usdcRequirements.length > 0) {
    return usdcRequirements[0];
  }
  if (broadlyAcceptedPaymentRequirements.length > 0) {
    return broadlyAcceptedPaymentRequirements[0];
  }
  return paymentRequirements[0];
}

// src/client/signPaymentHeader.ts
async function signPaymentHeader2(client, paymentRequirements, unsignedPaymentHeader) {
  if (paymentRequirements.scheme === "exact" && SupportedEVMNetworks.includes(paymentRequirements.network)) {
    const signedPaymentHeader = await signPaymentHeader(client, paymentRequirements, unsignedPaymentHeader);
    return encodePayment(signedPaymentHeader);
  }
  throw new Error("Unsupported scheme");
}

// src/shared/paywall.ts
function getPaywallHtml({
  amount,
  testnet,
  paymentRequirements,
  currentUrl
}) {
  const selectedPaymentRequirements = selectPaymentRequirements(
    paymentRequirements,
    testnet ? "base-sepolia" : "base",
    "exact"
  );
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Required - $${amount}</title>
<link rel="icon" href="/favicon.ico" sizes="any" />

<style>
  /* Reset */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
  img, picture, video, canvas, svg { display: block; max-width: 100%; }
  input, button, textarea, select { font: inherit; }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

  /* Custom Styles */
  body {
    min-height: 100vh;
    background-color: #f9fafb;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .container {
    max-width: 32rem;
    margin: 4rem auto;
    padding: 1.5rem;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #4b5563;
    margin-bottom: 1rem;
  }

  .instructions {
    font-size: 0.9rem;
    color: #4b5563;
    font-style: italic;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .button {
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 150ms;
  }

  .button:focus {
    outline: none;
    ring: 2px solid rgba(59, 130, 246, 0.5);
  }

  .button-blue {
    background-color: #2563eb;
    color: white;
  }

  .button-blue:hover {
    background-color: #1d4ed8;
  }

  .button-green {
    background-color: #059669;
    color: white;
  }

  .button-green:hover {
    background-color: #047857;
  }

  .payment-details {
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
  }

  .payment-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .payment-row:last-child {
    margin-bottom: 0;
  }

  .payment-label {
    color: #4b5563;
  }

  .payment-value {
    font-weight: 500;
  }

  .hidden {
    display: none;
  }

  .status {
    text-align: center;
    font-size: 0.875rem;
  }
</style>

<!-- Inject server-side variables -->
<script>
  try {
    // Initialize x402 namespace
    window.x402 = {
      paymentRequirements: ${JSON.stringify(selectedPaymentRequirements)},
      isTestnet: ${testnet},
      currentUrl: "${currentUrl}",
      state: {
        publicClient: null,
        chain: null,
        walletClient: null
      },
      config: {
        chainConfig: {
          "84532": {
            usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
            usdcName: "USDC",
          },
          "8453": {
            usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            usdcName: "USDC",
          }
        },
        networkToChainId: {
          "base-sepolia": 84532,
          "base": 8453
        }
      }
    };
    console.log('Payment requirements initialized:', window.x402.paymentRequirements);
  } catch (error) {
    console.error('Error initializing x402:', error.message);
  };
</script>

<!-- x402 -->
<script type="module">
  import {
    createWalletClient,
    createPublicClient,
    http,
    custom,
    toHex,
  } from 'https://esm.sh/viem'

  import {
    createConfig,
    connect,
    disconnect,
    signMessage,
    getBalance,
  } from 'https://esm.sh/@wagmi/core'

  import { injected, coinbaseWallet } from 'https://esm.sh/@wagmi/connectors'

  import { base, baseSepolia } from 'https://esm.sh/viem/chains'

  const authorizationTypes = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };

  // USDC ABI for version function
  const usdcABI = [{
    "inputs": [],
    "name": "version",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }];

  window.x402.utils = {
    createNonce: () => {
      return toHex(crypto.getRandomValues(new Uint8Array(32)));
    },
    safeBase64Encode: (data) => {
      if (typeof window !== "undefined") {
        return window.btoa(data);
      }
      return Buffer.from(data).toString("base64");
    },
    getUsdcAddressForChain: (chainId) => {
      return window.x402.config.chainConfig[chainId.toString()].usdcAddress;
    },
    getNetworkId: (network) => {
      const chainId = window.x402.config.networkToChainId[network];
      if (!chainId) {
        throw new Error('Unsupported network: ' + network);
      }
      return chainId;
    },
    getVersion: async (publicClient, usdcAddress) => {
      const version = await publicClient.readContract({
        address: usdcAddress,
        abi: usdcABI,
        functionName: "version"
      });
      return version;
    },
    encodePayment: (payment) => {
      const safe = {
        ...payment,
        payload: {
          ...payment.payload,
          authorization: Object.fromEntries(
            Object.entries(payment.payload.authorization).map(([key, value]) => [
              key,
              typeof value === "bigint" ? value.toString() : value,
            ])
          ),
        },
      };
      return window.x402.utils.safeBase64Encode(JSON.stringify(safe));
    },
    createPaymentHeader: async (client, publicClient) => {
      const payment = await window.x402.utils.createPayment(client, publicClient);
      return window.x402.utils.encodePayment(payment);
    },
  }

  window.x402.utils.signAuthorization = async (walletClient, authorizationParameters, paymentRequirements, publicClient) => {
    const chainId = window.x402.utils.getNetworkId(paymentRequirements.network);
    const name = paymentRequirements.extra?.name ?? window.x402.config.chainConfig[chainId].usdcName;
    const erc20Address = paymentRequirements.asset;
    const version = paymentRequirements.extra?.version ?? await window.x402.utils.getVersion(publicClient, erc20Address);
    const { from, to, value, validAfter, validBefore, nonce } = authorizationParameters;
    const data = {
      account: walletClient.account,
      types: authorizationTypes,
      domain: {
        name,
        version,
        chainId,
        verifyingContract: erc20Address,
      },
      primaryType: "TransferWithAuthorization",
      message: {
        from,
        to,
        value,
        validAfter,
        validBefore,
        nonce,
      },
    };

    const signature = await walletClient.signTypedData(data);

    return {
      signature,
    };
  }

  window.x402.utils.createPayment = async (client, publicClient) => {
    if (!window.x402.paymentRequirements) {
      throw new Error('Payment requirements not initialized');
    }

    const nonce = window.x402.utils.createNonce();
    const version = await window.x402.utils.getVersion(publicClient, window.x402.utils.getUsdcAddressForChain(window.x402.utils.getNetworkId(window.x402.paymentRequirements.network)));
    const from = client.account.address;

    const validAfter = BigInt(
      Math.floor(Date.now() / 1000) - 60 // 60 seconds before
    );
    const validBefore = BigInt(
      Math.floor(Date.now() / 1000 + window.x402.paymentRequirements.maxTimeoutSeconds)
    );

    const { signature } = await window.x402.utils.signAuthorization(
      client,
      {
        from,
        to: window.x402.paymentRequirements.payTo,
        value: window.x402.paymentRequirements.maxAmountRequired,
        validAfter,
        validBefore,
        nonce,
        version,
      },
      window.x402.paymentRequirements,
      publicClient
    );

    return {
      x402Version: 1,
      scheme: window.x402.paymentRequirements.scheme,
      network: window.x402.paymentRequirements.network,
      payload: {
        signature,
        authorization: {
          from,
          to: window.x402.paymentRequirements.payTo,
          value: window.x402.paymentRequirements.maxAmountRequired,
          validAfter,
          validBefore,
          nonce,
        },
      },
    };
  }


  async function initializeApp() {
    const x402 = window.x402;
    const wagmiConfig = createConfig({
      chains: [base, baseSepolia],
      connectors: [
        coinbaseWallet({ appName: 'Create Wagmi' }),
        injected(),
      ],
      transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
      },
    });

    // DOM Elements
    const connectWalletBtn = document.getElementById('connect-wallet');
    const paymentSection = document.getElementById('payment-section');
    const payButton = document.getElementById('pay-button');
    const statusDiv = document.getElementById('status');

    if (!connectWalletBtn || !paymentSection || !payButton || !statusDiv) {
      // console.error('Required DOM elements not found');
      return;
    }

    let walletClient = null;
    const chain = x402.isTestnet ? baseSepolia : base;

    const publicClient = createPublicClient({
      chain,
      transport: custom(window.ethereum),
    });

    // Connect wallet handler
    connectWalletBtn.addEventListener('click', async () => {
      // If wallet is already connected, disconnect it
      if (walletClient) {
        try {
          await disconnect(wagmiConfig);
          walletClient = null;
          connectWalletBtn.textContent = 'Connect Wallet';
          paymentSection.classList.add('hidden');
          statusDiv.textContent = 'Wallet disconnected';
          return;
        } catch (error) {
          statusDiv.textContent = 'Failed to disconnect wallet';
          return;
        }
      }

      try {
        statusDiv.textContent = 'Connecting wallet...';

        const result = await connect(wagmiConfig, {
          connector: injected(),
          chainId: chain.id,
        });
        if (!result.accounts?.[0]) {
          throw new Error('Please select an account in your wallet');
        }
        walletClient = createWalletClient({
          account: result.accounts[0],
          chain,
          transport: custom(window.ethereum)
        });

        const address = result.accounts[0]

        connectWalletBtn.textContent = \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
        paymentSection.classList.remove('hidden');
        statusDiv.textContent =
          'Wallet connected! You can now proceed with payment.';
      } catch (error) {
        console.error('Connection error:', error);
        statusDiv.textContent =
          error instanceof Error ? error.message : 'Failed to connect wallet';
        // Reset UI state
        connectWalletBtn.textContent = 'Connect Wallet';
        paymentSection.classList.add('hidden');
      }
    });

  // Payment handler
  payButton.addEventListener('click', async () => {
    if (!walletClient) {
      statusDiv.textContent = 'Please connect your wallet first';
      return;
    }

    try {
      const usdcAddress = window.x402.config.chainConfig[chain.id].usdcAddress;
      try {
        statusDiv.textContent = 'Checking USDC balance...';
        const balance = await publicClient.readContract({
          address: usdcAddress,
          abi: [{
            inputs: [{ internalType: "address", name: "account", type: "address" }],
            name: "balanceOf",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          }],
          functionName: "balanceOf",
          args: [walletClient.account.address]
        });

        if (balance === 0n) {
          statusDiv.textContent = \`Your USDC balance is 0. Please make sure you have USDC tokens on ${testnet ? "Base Sepolia" : "Base"}.\`;
          return;
        }

        statusDiv.textContent = 'Creating payment signature...';

        const paymentHeader = await x402.utils.createPaymentHeader(walletClient, publicClient);

        statusDiv.textContent = 'Requesting content with payment...';

        const response = await fetch(x402.currentUrl, {
          headers: {
            'X-PAYMENT': paymentHeader,
            'Access-Control-Expose-Headers': 'X-PAYMENT-RESPONSE',
          },
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            document.documentElement.innerHTML = await response.text();
          } else {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.location.href = url;
          }
        } else {
          throw new Error('Payment failed: ' + response.statusText);
        }
      } catch (error) {
        statusDiv.textContent = error instanceof Error ? error.message : 'Failed to check USDC balance';
      }
    } catch (error) {
      statusDiv.textContent = error instanceof Error ? error.message : 'Payment failed';
    }
  });
}

window.addEventListener('load', initializeApp);
</script>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Payment Required</h1>
      <p class="subtitle">${selectedPaymentRequirements.description}. To access this content, please pay $${amount} ${testnet ? "Base Sepolia" : "Base"} USDC.</p>
      <p class="instructions">Need Base Sepolia USDC? <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer">Get some here.</a></p>
    </div>

    <div class="content">
      <div id="connect-section">
        <button id="connect-wallet" class="button button-blue">
            Connect Wallet
        </button>
      </div>

      <div id="payment-section" class="hidden">
        <div class="payment-details">
          <div class="payment-row">
            <span class="payment-label">Amount:</span>
            <span class="payment-value">$${amount} USDC</span>
          </div>
          <div class="payment-row">
            <span class="payment-label">Network:</span>
            <span class="payment-value">${testnet ? "Base Sepolia" : "Base"}</span>
          </div>
        </div>

        <button id="pay-button" class="button button-green">
            Pay Now
        </button>
      </div>
      <div id="status" class="status"></div>
    </div>
  </div>
</body>
</html>`;
}

// src/shared/base64.ts
function safeBase64Encode(data) {
  return Buffer.from(data).toString("base64");
}
function safeBase64Decode(data) {
  return Buffer.from(data, "base64").toString("utf-8");
}

// src/shared/cdp.ts
import { generateJwt } from "@coinbase/cdp-sdk/auth";

// src/version.ts
var version = "0.3.3";

// src/shared/cdp.ts
var SDK_VERSION = "1.1.1";
async function createAuthHeader(apiKeyId, apiKeySecret, requestHost, requestPath) {
  const jwt = await generateJwt({
    apiKeyId,
    apiKeySecret,
    requestMethod: "POST",
    requestHost,
    requestPath
  });
  return `Bearer ${jwt}`;
}
function createCorrelationHeader() {
  const data = {
    sdk_version: SDK_VERSION,
    sdk_language: "typescript",
    source: "x402",
    source_version: version
  };
  return Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join(",");
}

// src/shared/middleware.ts
function computeRoutePatterns(routes) {
  const normalizedRoutes = Object.fromEntries(
    Object.entries(routes).map(([pattern, value]) => [
      pattern,
      typeof value === "string" || typeof value === "number" ? { price: value, network: "base-sepolia" } : value
    ])
  );
  return Object.entries(normalizedRoutes).map(([pattern, routeConfig]) => {
    const [verb, path] = pattern.includes(" ") ? pattern.split(/\s+/) : ["*", pattern];
    if (!path) {
      throw new Error(`Invalid route pattern: ${pattern}`);
    }
    return {
      verb: verb.toUpperCase(),
      pattern: new RegExp(
        `^${path.replace(/\*/g, ".*?").replace(/\[([^\]]+)\]/g, "[^/]+").replace(/\//g, "\\/")}$`,
        "i"
      ),
      config: routeConfig
    };
  });
}
function findMatchingRoute(routePatterns, path, method) {
  const matchingRoutes = routePatterns.filter(({ pattern, verb }) => {
    const matchesPath = pattern.test(path);
    const matchesVerb = verb === "*" || verb === method.toUpperCase();
    return matchesPath && matchesVerb;
  });
  if (matchingRoutes.length === 0) {
    return void 0;
  }
  const matchingRoute = matchingRoutes.reduce(
    (a, b) => b.pattern.source.length > a.pattern.source.length ? b : a
  );
  return matchingRoute;
}
function getDefaultAsset(network) {
  return {
    address: getUsdcAddressForChain(getNetworkId(network)),
    decimals: 6,
    eip712: {
      name: network === "base" ? "USD Coin" : "USDC",
      version: "2"
    }
  };
}
function processPriceToAtomicAmount(price, network) {
  let maxAmountRequired;
  let asset;
  if (typeof price === "string" || typeof price === "number") {
    const parsedAmount = moneySchema.safeParse(price);
    if (!parsedAmount.success) {
      return {
        error: `Invalid price (price: ${price}). Must be in the form "$3.10", 0.10, "0.001", ${parsedAmount.error}`
      };
    }
    const parsedUsdAmount = parsedAmount.data;
    asset = getDefaultAsset(network);
    maxAmountRequired = (parsedUsdAmount * 10 ** asset.decimals).toString();
  } else {
    maxAmountRequired = price.amount;
    asset = price.asset;
  }
  return {
    maxAmountRequired,
    asset
  };
}
function findMatchingPaymentRequirements(paymentRequirements, payment) {
  return paymentRequirements.find(
    (value) => value.scheme === payment.scheme && value.network === payment.network
  );
}
function decodeXPaymentResponse(header) {
  const decoded = safeBase64Decode(header);
  return JSON.parse(decoded);
}

// src/types/verify/facilitator.ts
var facilitatorRequestSchema = z4.object({
  paymentHeader: z4.string(),
  paymentRequirements: PaymentRequirementsSchema
});
function settleResponseHeader(response) {
  return safeBase64Encode(JSON.stringify(response));
}
function settleResponseFromHeader(header) {
  const decoded = safeBase64Decode(header);
  return JSON.parse(decoded);
}

export {
  authorizationTypes,
  evm_exports,
  toJsonSafe,
  getPaywallHtml,
  safeBase64Encode,
  safeBase64Decode,
  moneySchema,
  NetworkSchema,
  SupportedEVMNetworks,
  EvmNetworkToChainId,
  ChainIdToNetwork,
  getNetworkId,
  createAuthHeader,
  createCorrelationHeader,
  schemes,
  x402Versions,
  ErrorReasons,
  PaymentRequirementsSchema,
  ExactEvmPayloadAuthorizationSchema,
  ExactEvmPayloadSchema,
  PaymentPayloadSchema,
  VerifyResponseSchema,
  SettleResponseSchema,
  SupportedPaymentKindSchema,
  SupportedPaymentKindsResponseSchema,
  facilitatorRequestSchema,
  settleResponseHeader,
  settleResponseFromHeader,
  computeRoutePatterns,
  findMatchingRoute,
  getDefaultAsset,
  processPriceToAtomicAmount,
  findMatchingPaymentRequirements,
  decodeXPaymentResponse,
  encodePayment,
  decodePayment,
  preparePaymentHeader,
  signPaymentHeader,
  createPayment,
  createPaymentHeader,
  createPaymentHeader2,
  preparePaymentHeader2,
  selectPaymentRequirements,
  signPaymentHeader2
};
//# sourceMappingURL=chunk-D2IMU5IS.mjs.map