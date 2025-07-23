"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var client_exports = {};
__export(client_exports, {
  createPaymentHeader: () => createPaymentHeader2,
  preparePaymentHeader: () => preparePaymentHeader2,
  selectPaymentRequirements: () => selectPaymentRequirements,
  signPaymentHeader: () => signPaymentHeader2
});
module.exports = __toCommonJS(client_exports);

// src/types/shared/evm/config.ts
var config = {
  "84532": {
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    usdcName: "USDC"
  },
  "8453": {
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    usdcName: "USDC"
  }
};

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

// src/types/shared/evm/wallet.ts
var import_viem = require("viem");
var import_chains = require("viem/chains");
var import_accounts = require("viem/accounts");
function isSignerWallet(wallet) {
  return "chain" in wallet && "transport" in wallet;
}
function isAccount(wallet) {
  return "address" in wallet && "type" in wallet;
}

// src/schemes/exact/evm/sign.ts
var import_crypto = require("crypto");
var import_viem2 = require("viem");

// src/shared/base64.ts
function safeBase64Encode(data) {
  return Buffer.from(data).toString("base64");
}

// src/types/shared/money.ts
var import_zod = require("zod");
var moneySchema = import_zod.z.union([import_zod.z.string().transform((x) => x.replace(/[^0-9.-]+/g, "")), import_zod.z.number()]).pipe(import_zod.z.coerce.number().min(1e-4).max(999999999));

// src/types/shared/network.ts
var import_zod2 = require("zod");
var NetworkSchema = import_zod2.z.enum(["base-sepolia", "base"]);
var SupportedEVMNetworks = ["base-sepolia", "base"];
var EvmNetworkToChainId = /* @__PURE__ */ new Map([
  ["base-sepolia", 84532],
  ["base", 8453]
]);
var ChainIdToNetwork = Object.fromEntries(
  SupportedEVMNetworks.map((network) => [EvmNetworkToChainId.get(network), network])
);

// src/shared/network.ts
function getNetworkId(network) {
  if (EvmNetworkToChainId.has(network)) {
    return EvmNetworkToChainId.get(network);
  }
  throw new Error(`Unsupported network: ${network}`);
}

// src/shared/cdp.ts
var import_auth = require("@coinbase/cdp-sdk/auth");

// src/types/verify/x402Specs.ts
var import_zod3 = require("zod");
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
var PaymentRequirementsSchema = import_zod3.z.object({
  scheme: import_zod3.z.enum(schemes),
  network: NetworkSchema,
  maxAmountRequired: import_zod3.z.string().refine(isInteger),
  resource: import_zod3.z.string().url(),
  description: import_zod3.z.string(),
  mimeType: import_zod3.z.string(),
  outputSchema: import_zod3.z.record(import_zod3.z.any()).optional(),
  payTo: import_zod3.z.string().regex(MixedAddressRegex),
  maxTimeoutSeconds: import_zod3.z.number().int(),
  asset: import_zod3.z.string().regex(MixedAddressRegex),
  extra: import_zod3.z.record(import_zod3.z.any()).optional()
});
var ExactEvmPayloadAuthorizationSchema = import_zod3.z.object({
  from: import_zod3.z.string().regex(EvmAddressRegex),
  to: import_zod3.z.string().regex(EvmAddressRegex),
  value: import_zod3.z.string().refine(isInteger).refine(hasMaxLength(EvmMaxAtomicUnits)),
  validAfter: import_zod3.z.string().refine(isInteger),
  validBefore: import_zod3.z.string().refine(isInteger),
  nonce: import_zod3.z.string().regex(HexEncoded64ByteRegex)
});
var ExactEvmPayloadSchema = import_zod3.z.object({
  signature: import_zod3.z.string().regex(EvmSignatureRegex),
  authorization: ExactEvmPayloadAuthorizationSchema
});
var PaymentPayloadSchema = import_zod3.z.object({
  x402Version: import_zod3.z.number().refine((val) => x402Versions.includes(val)),
  scheme: import_zod3.z.enum(schemes),
  network: NetworkSchema,
  payload: ExactEvmPayloadSchema
});
var VerifyResponseSchema = import_zod3.z.object({
  isValid: import_zod3.z.boolean(),
  invalidReason: import_zod3.z.enum(ErrorReasons).optional(),
  payer: import_zod3.z.string().regex(MixedAddressRegex).optional()
});
var SettleResponseSchema = import_zod3.z.object({
  success: import_zod3.z.boolean(),
  errorReason: import_zod3.z.enum(ErrorReasons).optional(),
  payer: import_zod3.z.string().regex(MixedAddressRegex).optional(),
  transaction: import_zod3.z.string().regex(MixedAddressRegex),
  network: NetworkSchema
});
var SupportedPaymentKindSchema = import_zod3.z.object({
  x402Version: import_zod3.z.number().refine((val) => x402Versions.includes(val)),
  scheme: import_zod3.z.enum(schemes),
  network: NetworkSchema
});
var SupportedPaymentKindsResponseSchema = import_zod3.z.object({
  kinds: import_zod3.z.array(SupportedPaymentKindSchema)
});

// src/types/verify/facilitator.ts
var import_zod4 = require("zod");
var facilitatorRequestSchema = import_zod4.z.object({
  paymentHeader: import_zod4.z.string(),
  paymentRequirements: PaymentRequirementsSchema
});

// src/shared/evm/usdc.ts
function getUsdcAddressForChain(chainId) {
  return config[chainId.toString()].usdcAddress;
}

// src/schemes/exact/evm/sign.ts
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
  return (0, import_viem2.toHex)((0, import_crypto.getRandomValues)(new Uint8Array(32)));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPaymentHeader,
  preparePaymentHeader,
  selectPaymentRequirements,
  signPaymentHeader
});
//# sourceMappingURL=index.js.map