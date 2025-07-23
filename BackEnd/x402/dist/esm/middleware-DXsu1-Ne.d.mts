import { z } from 'zod';
import { a as Network } from './network-BC2BTbek.mjs';
import { a as PaymentPayload, P as PaymentRequirements, V as VerifyResponse, S as SettleResponse } from './x402Specs-DiRUbZpY.mjs';

declare const moneySchema: z.ZodPipeline<z.ZodUnion<[z.ZodEffects<z.ZodString, string, string>, z.ZodNumber]>, z.ZodNumber>;
type Money = z.input<typeof moneySchema>;

type Resource = `${string}://${string}`;

type CreateHeaders = () => Promise<{
    verify: Record<string, string>;
    settle: Record<string, string>;
}>;
/**
 * Creates a facilitator client for interacting with the X402 payment facilitator service
 *
 * @param facilitator - The facilitator config to use. If not provided, the default facilitator will be used.
 * @returns An object containing verify and settle functions for interacting with the facilitator
 */
declare function useFacilitator(facilitator?: FacilitatorConfig): {
    verify: (payload: PaymentPayload, paymentRequirements: PaymentRequirements) => Promise<VerifyResponse>;
    settle: (payload: PaymentPayload, paymentRequirements: PaymentRequirements) => Promise<SettleResponse>;
};
declare const verify: (payload: PaymentPayload, paymentRequirements: PaymentRequirements) => Promise<VerifyResponse>;
declare const settle: (payload: PaymentPayload, paymentRequirements: PaymentRequirements) => Promise<SettleResponse>;

type FacilitatorConfig = {
    url: Resource;
    createAuthHeaders?: CreateHeaders;
};
type PaymentMiddlewareConfig = {
    description?: string;
    mimeType?: string;
    maxTimeoutSeconds?: number;
    outputSchema?: object;
    customPaywallHtml?: string;
    resource?: Resource;
};
interface ERC20TokenAmount {
    amount: string;
    asset: {
        address: `0x${string}`;
        decimals: number;
        eip712: {
            name: string;
            version: string;
        };
    };
}
type Price = Money | ERC20TokenAmount;
interface RouteConfig {
    price: Price;
    network: Network;
    config?: PaymentMiddlewareConfig;
}
type RoutesConfig = Record<string, Price | RouteConfig>;
interface RoutePattern {
    verb: string;
    pattern: RegExp;
    config: RouteConfig;
}

export { type CreateHeaders as C, type ERC20TokenAmount as E, type FacilitatorConfig as F, type Money as M, type PaymentMiddlewareConfig as P, type Resource as R, type Price as a, type RouteConfig as b, type RoutesConfig as c, type RoutePattern as d, moneySchema as m, settle as s, useFacilitator as u, verify as v };
