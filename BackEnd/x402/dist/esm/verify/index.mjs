import {
  toJsonSafe
} from "../chunk-D2IMU5IS.mjs";
import "../chunk-BQ26ZGM7.mjs";

// src/verify/useFacilitator.ts
import axios from "axios";
var DEFAULT_FACILITATOR_URL = "https://x402.org/facilitator";
function useFacilitator(facilitator) {
  async function verify2(payload, paymentRequirements) {
    const url = (facilitator == null ? void 0 : facilitator.url) || DEFAULT_FACILITATOR_URL;
    const res = await axios.post(
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
    const res = await axios.post(
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
export {
  settle,
  useFacilitator,
  verify
};
//# sourceMappingURL=index.mjs.map