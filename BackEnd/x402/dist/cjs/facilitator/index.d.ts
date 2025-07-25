import { Transport, Chain, Account } from 'viem';
import { C as ConnectedClient, S as SignerWallet } from '../wallet-DPX47Wk4.js';
import { a as PaymentPayload, P as PaymentRequirements, V as VerifyResponse, S as SettleResponse } from '../x402Specs-DiRUbZpY.js';
import 'viem/chains';
import 'zod';

/**
 * Verifies a payment payload against the required payment details regardless of the scheme
 * this function wraps all verify functions for each specific scheme
 *
 * @param client - The public client used for blockchain interactions
 * @param payload - The signed payment payload containing transfer parameters and signature
 * @param paymentRequirements - The payment requirements that the payload must satisfy
 * @returns A ValidPaymentRequest indicating if the payment is valid and any invalidation reason
 */
declare function verify<transport extends Transport, chain extends Chain, account extends Account | undefined>(client: ConnectedClient<transport, chain, account>, payload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<VerifyResponse>;
/**
 * Settles a payment payload against the required payment details regardless of the scheme
 * this function wraps all settle functions for each specific scheme
 *
 * @param client - The signer wallet used for blockchain interactions
 * @param payload - The signed payment payload containing transfer parameters and signature
 * @param paymentRequirements - The payment requirements that the payload must satisfy
 * @returns A SettleResponse indicating if the payment is settled and any settlement reason
 */
declare function settle<transport extends Transport, chain extends Chain>(client: SignerWallet<chain, transport>, payload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<SettleResponse>;
type Supported = {
    x402Version: number;
    kind: {
        scheme: string;
        networkId: string;
    }[];
};

export { type Supported, settle, verify };
