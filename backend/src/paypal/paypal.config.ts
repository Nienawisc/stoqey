import 'dotenv/config';
import { get } from "lodash";

// @ts-ignore
import paypal from "@paypal/checkout-server-sdk";

const clientId = get(process.env, "PAYPAL_ID", "");
const secret = get(process.env, "PAYPAL_SECRET", "");
const env = get(process.env, "PAYPAL_ENV", "sandbox");
const currency = get(process.env, "PAYPAL_CURRENCY", "USD");

export const payPalConfig = {
  clientId,
  secret,
  env,
  currency,
};

export const getPayPalClient = () => {
  let environment = new paypal.core.SandboxEnvironment(clientId, secret);
  if (env === "live") {
    environment = new paypal.core.LiveEnvironment(clientId, secret);
  }
  let client = new paypal.core.PayPalHttpClient(environment);
  return client;
};

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
