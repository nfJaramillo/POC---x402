import { S as SignerWallet } from '../wallet-DPX47Wk4.js';
import { P as PaymentRequirements, U as UnsignedPaymentPayload } from '../x402Specs-DiRUbZpY.js';
import { Address } from 'viem';
import { a as Network } from '../network-BC2BTbek.js';
import 'viem/chains';
import 'zod';

/**
 * Creates a payment header based on the provided client and payment requirements.
 *
 * @param client - The signer wallet instance used to create the payment header
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the created payment header string
 */
declare function createPaymentHeader(client: SignerWallet, x402Version: number, paymentRequirements: PaymentRequirements): Promise<string>;

/**
 * Prepares a payment header with the given sender address and payment requirements.
 *
 * @param from - The sender's address from which the payment will be made
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns An unsigned payment payload that can be used to create a payment header
 */
declare function preparePaymentHeader(from: Address, x402Version: number, paymentRequirements: PaymentRequirements): UnsignedPaymentPayload;

/**
 * Default selector for payment requirements.
 * Default behavior is to select the first payment requirement that has a USDC asset.
 * If no USDC payment requirement is found, the first payment requirement is selected.
 *
 * @param paymentRequirements - The payment requirements to select from.
 * @param network - The network to check against. If not provided, the network will not be checked.
 * @param scheme - The scheme to check against. If not provided, the scheme will not be checked.
 * @returns The payment requirement that is the most appropriate for the user.
 */
declare function selectPaymentRequirements(paymentRequirements: PaymentRequirements[], network?: Network, scheme?: "exact"): PaymentRequirements;
/**
 * Selector for payment requirements.
 *
 * @param paymentRequirements - The payment requirements to select from.
 * @param network - The network to check against. If not provided, the network will not be checked.
 * @param scheme - The scheme to check against. If not provided, the scheme will not be checked.
 * @returns The payment requirement that is the most appropriate for the user.
 */
type PaymentRequirementsSelector = (paymentRequirements: PaymentRequirements[], network?: Network, scheme?: "exact") => PaymentRequirements;

/**
 * Signs a payment header using the provided client and payment requirements.
 *
 * @param client - The signer wallet instance used to sign the payment header
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @param unsignedPaymentHeader - The unsigned payment payload to be signed
 * @returns A promise that resolves to the encoded signed payment header string
 */
declare function signPaymentHeader(client: SignerWallet, paymentRequirements: PaymentRequirements, unsignedPaymentHeader: UnsignedPaymentPayload): Promise<string>;

export { type PaymentRequirementsSelector, createPaymentHeader, preparePaymentHeader, selectPaymentRequirements, signPaymentHeader };
