import { Address, Transport, Chain, Account } from 'viem';
import { S as SignerWallet, C as ConnectedClient } from '../wallet-DPX47Wk4.mjs';
import { P as PaymentRequirements, U as UnsignedPaymentPayload, a as PaymentPayload, V as VerifyResponse, S as SettleResponse } from '../x402Specs-DiRUbZpY.mjs';
import 'viem/chains';
import 'zod';

/**
 * Prepares an unsigned payment header with the given sender address and payment requirements.
 *
 * @param from - The sender's address from which the payment will be made
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns An unsigned payment payload containing authorization details
 */
declare function preparePaymentHeader(from: Address, x402Version: number, paymentRequirements: PaymentRequirements): UnsignedPaymentPayload;
/**
 * Signs a payment header using the provided client and payment requirements.
 *
 * @param client - The signer wallet instance used to sign the payment header
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @param unsignedPaymentHeader - The unsigned payment payload to be signed
 * @returns A promise that resolves to the signed payment payload
 */
declare function signPaymentHeader<transport extends Transport, chain extends Chain>(client: SignerWallet<chain, transport> | Account, paymentRequirements: PaymentRequirements, unsignedPaymentHeader: UnsignedPaymentPayload): Promise<PaymentPayload>;
/**
 * Creates a complete payment payload by preparing and signing a payment header.
 *
 * @param client - The signer wallet instance used to create and sign the payment
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the complete signed payment payload
 */
declare function createPayment<transport extends Transport, chain extends Chain>(client: SignerWallet<chain, transport> | Account, x402Version: number, paymentRequirements: PaymentRequirements): Promise<PaymentPayload>;
/**
 * Creates and encodes a payment header for the given client and payment requirements.
 *
 * @param client - The signer wallet instance used to create the payment header
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the encoded payment header string
 */
declare function createPaymentHeader(client: SignerWallet | Account, x402Version: number, paymentRequirements: PaymentRequirements): Promise<string>;

/**
 * Verifies a payment payload against the required payment details
 *
 * This function performs several verification steps:
 * - Verifies protocol version compatibility
 * - Validates the permit signature
 * - Confirms USDC contract address is correct for the chain
 * - Checks permit deadline is sufficiently in the future
 * - Verifies client has sufficient USDC balance
 * - Ensures payment amount meets required minimum
 *
 * @param client - The public client used for blockchain interactions
 * @param payload - The signed payment payload containing transfer parameters and signature
 * @param paymentRequirements - The payment requirements that the payload must satisfy
 * @returns A ValidPaymentRequest indicating if the payment is valid and any invalidation reason
 */
declare function verify<transport extends Transport, chain extends Chain, account extends Account | undefined>(client: ConnectedClient<transport, chain, account>, payload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<VerifyResponse>;
/**
 * Settles a payment by executing a USDC transferWithAuthorization transaction
 *
 * This function executes the actual USDC transfer using the signed authorization from the user.
 * The facilitator wallet submits the transaction but does not need to hold or transfer any tokens itself.
 *
 * @param wallet - The facilitator wallet that will submit the transaction
 * @param paymentPayload - The signed payment payload containing the transfer parameters and signature
 * @param paymentRequirements - The original payment details that were used to create the payload
 * @returns A PaymentExecutionResponse containing the transaction status and hash
 */
declare function settle<transport extends Transport, chain extends Chain>(wallet: SignerWallet<chain, transport>, paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<SettleResponse>;

/**
 * Encodes a payment payload into a base64 string, ensuring bigint values are properly stringified
 *
 * @param payment - The payment payload to encode
 * @returns A base64 encoded string representation of the payment payload
 */
declare function encodePayment(payment: PaymentPayload): string;
/**
 * Decodes a base64 encoded payment string back into a PaymentPayload object
 *
 * @param payment - The base64 encoded payment string to decode
 * @returns The decoded and validated PaymentPayload object
 */
declare function decodePayment(payment: string): PaymentPayload;

declare const index$1_createPayment: typeof createPayment;
declare const index$1_createPaymentHeader: typeof createPaymentHeader;
declare const index$1_decodePayment: typeof decodePayment;
declare const index$1_encodePayment: typeof encodePayment;
declare const index$1_preparePaymentHeader: typeof preparePaymentHeader;
declare const index$1_settle: typeof settle;
declare const index$1_signPaymentHeader: typeof signPaymentHeader;
declare const index$1_verify: typeof verify;
declare namespace index$1 {
  export { index$1_createPayment as createPayment, index$1_createPaymentHeader as createPaymentHeader, index$1_decodePayment as decodePayment, index$1_encodePayment as encodePayment, index$1_preparePaymentHeader as preparePaymentHeader, index$1_settle as settle, index$1_signPaymentHeader as signPaymentHeader, index$1_verify as verify };
}

declare const SCHEME = "exact";

declare const index_SCHEME: typeof SCHEME;
declare namespace index {
  export { index_SCHEME as SCHEME, index$1 as evm };
}

export { index as exact };
