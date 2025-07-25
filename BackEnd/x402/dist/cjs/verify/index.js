"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/verify/index.ts
var verify_exports = {};
__export(verify_exports, {
  settle: () => settle,
  useFacilitator: () => useFacilitator,
  verify: () => verify
});
module.exports = __toCommonJS(verify_exports);

// src/verify/useFacilitator.ts
var import_axios = __toESM(require("axios"));

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

// src/types/shared/evm/wallet.ts
var import_viem = require("viem");
var import_chains = require("viem/chains");
var import_accounts = require("viem/accounts");

// src/schemes/exact/evm/sign.ts
var import_viem2 = require("viem");

// src/types/verify/x402Specs.ts
var import_zod3 = require("zod");

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

// src/types/verify/x402Specs.ts
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

// src/shared/cdp.ts
var import_auth = require("@coinbase/cdp-sdk/auth");

// src/verify/useFacilitator.ts
var DEFAULT_FACILITATOR_URL = "https://x402.org/facilitator";
function useFacilitator(facilitator) {
  async function verify2(payload, paymentRequirements) {
    const url = (facilitator == null ? void 0 : facilitator.url) || DEFAULT_FACILITATOR_URL;
    const res = await import_axios.default.post(
      `${url}/verify`,
      {
        x402Version: payload.x402Version,
        paymentPayload: toJsonSafe(payload),
        paymentRequirements: toJsonSafe(paymentRequirements)
      },
      {
        headers: (facilitator == null ? void 0 : facilitator.createAuthHeaders) ? (await facilitator.createAuthHeaders()).verify : void 0
      }
    );
    if (res.status !== 200) {
      throw new Error(`Failed to verify payment: ${res.statusText}`);
    }
    return res.data;
  }
  async function settle2(payload, paymentRequirements) {
    const url = (facilitator == null ? void 0 : facilitator.url) || DEFAULT_FACILITATOR_URL;
    const res = await import_axios.default.post(
      `${url}/settle`,
      {
        x402Version: payload.x402Version,
        paymentPayload: toJsonSafe(payload),
        paymentRequirements: toJsonSafe(paymentRequirements)
      },
      {
        headers: (facilitator == null ? void 0 : facilitator.createAuthHeaders) ? (await facilitator.createAuthHeaders()).settle : void 0
      }
    );
    if (res.status !== 200) {
      throw new Error(`Failed to settle payment: ${res.statusText}`);
    }
    return res.data;
  }
  return { verify: verify2, settle: settle2 };
}
var { verify, settle } = useFacilitator();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  settle,
  useFacilitator,
  verify
});
//# sourceMappingURL=index.js.map