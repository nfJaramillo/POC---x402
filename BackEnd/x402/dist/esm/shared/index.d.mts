import { P as PaymentRequirements, a as PaymentPayload } from '../x402Specs-DiRUbZpY.mjs';
import { a as Network } from '../network-BC2BTbek.mjs';
import { Hex, Address } from 'viem';
import { c as RoutesConfig, d as RoutePattern, a as Price, E as ERC20TokenAmount } from '../middleware-DXsu1-Ne.mjs';
import 'zod';

/**
 * Converts an object to a JSON-safe format by converting bigint values to strings
 * and recursively processing nested objects and arrays
 *
 * @param data - The object to convert to JSON-safe format
 * @returns A new object with all bigint values converted to strings
 */
declare function toJsonSafe<T extends object>(data: T): object;

interface PaywallOptions {
    amount: number;
    paymentRequirements: PaymentRequirements[];
    currentUrl: string;
    testnet: boolean;
}
/**
 * Generates an HTML paywall page that allows users to pay for content access
 *
 * @param options - The options for generating the paywall
 * @param options.amount - The amount to be paid in USD
 * @param options.paymentRequirements - The payment requirements for the content
 * @param options.currentUrl - The URL of the content being accessed
 * @param options.testnet - Whether to use testnet or mainnet
 * @returns An HTML string containing the paywall page
 */
declare function getPaywallHtml({ amount, testnet, paymentRequirements, currentUrl, }: PaywallOptions): string;

/**
 * Encodes a string to base64 format
 *
 * @param data - The string to be encoded to base64
 * @returns The base64 encoded string
 */
declare function safeBase64Encode(data: string): string;
/**
 * Decodes a base64 string back to its original format
 *
 * @param data - The base64 encoded string to be decoded
 * @returns The decoded string in UTF-8 format
 */
declare function safeBase64Decode(data: string): string;

/**
 * Converts a network name to its corresponding chain ID
 *
 * @param network - The network name to convert to a chain ID
 * @returns The chain ID for the specified network
 * @throws Error if the network is not supported
 */
declare function getNetworkId(network: Network): number;

/**
 * Creates an authorization header for a request to the Coinbase API.
 *
 * @param apiKeyId - The api key ID
 * @param apiKeySecret - The api key secret
 * @param requestHost - The host for the request (e.g. 'https://x402.org/facilitator')
 * @param requestPath - The path for the request (e.g. '/verify')
 * @returns The authorization header string
 */
declare function createAuthHeader(apiKeyId: string, apiKeySecret: string, requestHost: string, requestPath: string): Promise<string>;
/**
 * Creates a correlation header for a request to the Coinbase API.
 *
 * @returns The correlation header string
 */
declare function createCorrelationHeader(): string;

/**
 * Computes the route patterns for the given routes config
 *
 * @param routes - The routes config to compute the patterns for
 * @returns The route patterns
 */
declare function computeRoutePatterns(routes: RoutesConfig): RoutePattern[];
/**
 * Finds the matching route pattern for the given path and method
 *
 * @param routePatterns - The route patterns to search through
 * @param path - The path to match against
 * @param method - The HTTP method to match against
 * @returns The matching route pattern or undefined if no match is found
 */
declare function findMatchingRoute(routePatterns: RoutePattern[], path: string, method: string): RoutePattern | undefined;
/**
 * Gets the default asset (USDC) for the given network
 *
 * @param network - The network to get the default asset for
 * @returns The default asset
 */
declare function getDefaultAsset(network: Network): {
    address: `0x${string}`;
    decimals: number;
    eip712: {
        name: string;
        version: string;
    };
};
/**
 * Parses the amount from the given price
 *
 * @param price - The price to parse
 * @param network - The network to get the default asset for
 * @returns The parsed amount or an error message
 */
declare function processPriceToAtomicAmount(price: Price, network: Network): {
    maxAmountRequired: string;
    asset: ERC20TokenAmount["asset"];
} | {
    error: string;
};
/**
 * Finds the matching payment requirements for the given payment
 *
 * @param paymentRequirements - The payment requirements to search through
 * @param payment - The payment to match against
 * @returns The matching payment requirements or undefined if no match is found
 */
declare function findMatchingPaymentRequirements(paymentRequirements: PaymentRequirements[], payment: PaymentPayload): {
    scheme: "exact";
    description: string;
    network: "base-sepolia" | "base";
    maxAmountRequired: string;
    resource: string;
    mimeType: string;
    payTo: string;
    maxTimeoutSeconds: number;
    asset: string;
    outputSchema?: Record<string, any> | undefined;
    extra?: Record<string, any> | undefined;
} | undefined;
/**
 * Decodes the X-PAYMENT-RESPONSE header
 *
 * @param header - The X-PAYMENT-RESPONSE header to decode
 * @returns The decoded payment response
 */
declare function decodeXPaymentResponse(header: string): {
    success: boolean;
    transaction: Hex;
    network: Network;
    payer: Address;
};

export { computeRoutePatterns, createAuthHeader, createCorrelationHeader, decodeXPaymentResponse, findMatchingPaymentRequirements, findMatchingRoute, getDefaultAsset, getNetworkId, getPaywallHtml, processPriceToAtomicAmount, safeBase64Decode, safeBase64Encode, toJsonSafe };
