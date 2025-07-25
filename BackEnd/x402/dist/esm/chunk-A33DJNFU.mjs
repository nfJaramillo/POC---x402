import {
  authorizationTypes,
  createPayment,
  createPaymentHeader,
  decodePayment,
  encodePayment,
  getNetworkId,
  preparePaymentHeader,
  signPaymentHeader
} from "./chunk-D2IMU5IS.mjs";
import {
  __export,
  config,
  getERC20Balance,
  getVersion,
  usdcABI
} from "./chunk-BQ26ZGM7.mjs";

// src/schemes/exact/index.ts
var exact_exports = {};
__export(exact_exports, {
  SCHEME: () => SCHEME,
  evm: () => evm_exports
});

// src/schemes/exact/evm/index.ts
var evm_exports = {};
__export(evm_exports, {
  createPayment: () => createPayment,
  createPaymentHeader: () => createPaymentHeader,
  decodePayment: () => decodePayment,
  encodePayment: () => encodePayment,
  preparePaymentHeader: () => preparePaymentHeader,
  settle: () => settle,
  signPaymentHeader: () => signPaymentHeader,
  verify: () => verify
});

// src/schemes/exact/evm/facilitator.ts
import { verifyTypedData } from "viem";
async function verify(client, payload, paymentRequirements) {
  var _a, _b;
  if (payload.scheme !== SCHEME || paymentRequirements.scheme !== SCHEME) {
    return {
      isValid: false,
      invalidReason: `Incompatible payload scheme. payload: ${payload.scheme}, paymentRequirements: ${paymentRequirements.scheme}, supported: ${SCHEME}`,
      payer: payload.payload.authorization.from
    };
  }
  let name;
  let chainId;
  let erc20Address;
  let version;
  try {
    chainId = getNetworkId(payload.network);
    name = ((_a = paymentRequirements.extra) == null ? void 0 : _a.name) ?? config[chainId.toString()].usdcName;
    erc20Address = paymentRequirements.asset;
    version = ((_b = paymentRequirements.extra) == null ? void 0 : _b.version) ?? await getVersion(client);
  } catch {
    return {
      isValid: false,
      invalidReason: `invalid_network`,
      payer: payload.payload.authorization.from
    };
  }
  const permitTypedData = {
    types: authorizationTypes,
    primaryType: "TransferWithAuthorization",
    domain: {
      name,
      version,
      chainId,
      verifyingContract: erc20Address
    },
    message: {
      from: payload.payload.authorization.from,
      to: payload.payload.authorization.to,
      value: payload.payload.authorization.value,
      validAfter: payload.payload.authorization.validAfter,
      validBefore: payload.payload.authorization.validBefore,
      nonce: payload.payload.authorization.nonce
    }
  };
  const recoveredAddress = await verifyTypedData({
    address: payload.payload.authorization.from,
    ...permitTypedData,
    signature: payload.payload.signature
  });
  if (!recoveredAddress) {
    return {
      isValid: false,
      invalidReason: "invalid_scheme",
      //"Invalid permit signature",
      payer: payload.payload.authorization.from
    };
  }
  if (BigInt(payload.payload.authorization.validBefore) < BigInt(Math.floor(Date.now() / 1e3) + 6)) {
    return {
      isValid: false,
      invalidReason: "invalid_scheme",
      //"Deadline on permit isn't far enough in the future",
      payer: payload.payload.authorization.from
    };
  }
  if (BigInt(payload.payload.authorization.validAfter) > BigInt(Math.floor(Date.now() / 1e3))) {
    return {
      isValid: false,
      invalidReason: "invalid_scheme",
      //"Deadline on permit is in the future",
      payer: payload.payload.authorization.from
    };
  }
  const balance = await getERC20Balance(
    client,
    erc20Address,
    payload.payload.authorization.from
  );
  if (balance < BigInt(paymentRequirements.maxAmountRequired)) {
    return {
      isValid: false,
      invalidReason: "insufficient_funds",
      //"Client does not have enough funds",
      payer: payload.payload.authorization.from
    };
  }
  if (BigInt(payload.payload.authorization.value) < BigInt(paymentRequirements.maxAmountRequired)) {
    return {
      isValid: false,
      invalidReason: "invalid_scheme",
      //"Value in payload is not enough to cover paymentRequirements.maxAmountRequired",
      payer: payload.payload.authorization.from
    };
  }
  return {
    isValid: true,
    invalidReason: void 0,
    payer: payload.payload.authorization.from
  };
}
async function settle(wallet, paymentPayload, paymentRequirements) {
  const valid = await verify(wallet, paymentPayload, paymentRequirements);
  if (!valid.isValid) {
    return {
      success: false,
      network: paymentPayload.network,
      transaction: "",
      errorReason: "invalid_scheme",
      //`Payment is no longer valid: ${valid.invalidReason}`,
      payer: paymentPayload.payload.authorization.from
    };
  }
  const tx = await wallet.writeContract({
    address: paymentRequirements.asset,
    abi: usdcABI,
    functionName: "transferWithAuthorization",
    args: [
      paymentPayload.payload.authorization.from,
      paymentPayload.payload.authorization.to,
      BigInt(paymentPayload.payload.authorization.value),
      BigInt(paymentPayload.payload.authorization.validAfter),
      BigInt(paymentPayload.payload.authorization.validBefore),
      paymentPayload.payload.authorization.nonce,
      paymentPayload.payload.signature
    ],
    chain: wallet.chain
  });
  const receipt = await wallet.waitForTransactionReceipt({ hash: tx });
  if (receipt.status !== "success") {
    return {
      success: false,
      errorReason: "invalid_scheme",
      //`Transaction failed`,
      transaction: tx,
      network: paymentPayload.network,
      payer: paymentPayload.payload.authorization.from
    };
  }
  return {
    success: true,
    transaction: tx,
    network: paymentPayload.network,
    payer: paymentPayload.payload.authorization.from
  };
}

// src/schemes/exact/index.ts
var SCHEME = "exact";

export {
  exact_exports,
  verify,
  settle
};
//# sourceMappingURL=chunk-A33DJNFU.mjs.map