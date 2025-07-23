import {
  settle,
  verify
} from "./chunk-A33DJNFU.mjs";
import {
  SupportedEVMNetworks
} from "./chunk-D2IMU5IS.mjs";

// src/facilitator/facilitator.ts
async function verify2(client, payload, paymentRequirements) {
  if (paymentRequirements.scheme == "exact" && SupportedEVMNetworks.includes(paymentRequirements.network)) {
    const valid = await verify(client, payload, paymentRequirements);
    return valid;
  }
  return {
    isValid: false,
    invalidReason: "invalid_scheme",
    payer: payload.payload.authorization.from
  };
}
async function settle2(client, payload, paymentRequirements) {
  if (paymentRequirements.scheme == "exact" && SupportedEVMNetworks.includes(paymentRequirements.network)) {
    return settle(client, payload, paymentRequirements);
  }
  return {
    success: false,
    errorReason: "invalid_scheme",
    transaction: "",
    network: paymentRequirements.network,
    payer: payload.payload.authorization.from
  };
}

export {
  verify2 as verify,
  settle2 as settle
};
//# sourceMappingURL=chunk-7TENPWGC.mjs.map