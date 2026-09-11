import { NextResponse } from "next/server";
import { Client, CheckoutAPI, EnvironmentEnum, Types } from "@adyen/api-library";
import { config } from "dotenv";
import { resolve } from "path";

export const runtime = "nodejs";

config({
  path: resolve(process.cwd(), "..", "..", ".env.sarenza"),
  override: false,
  quiet: true,
});

type RequiredEnvironmentVariable =
  | "API_KEY"
  | "MERCHANT_ACCOUNT"
  | "NEXT_PUBLIC_CLIENT_KEY";

function getRequiredEnvironmentVariable(name: RequiredEnvironmentVariable) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in .env.sarenza`);
  }
  return value;
}

export async function POST(request: Request) {
  try {
    const { returnUrl } = await request.json();

    if (typeof returnUrl !== "string" || !returnUrl.startsWith("http")) {
      return NextResponse.json({ error: "A valid returnUrl is required" }, { status: 400 });
    }

    const client = new Client({
      apiKey: getRequiredEnvironmentVariable("API_KEY"),
      environment: EnvironmentEnum.TEST,
    });
    const checkout = new CheckoutAPI(client);
    const amount: Types.checkout.Amount = { currency: "EUR", value: 1000 };

    const session = await checkout.PaymentsApi.sessions({
      merchantAccount: getRequiredEnvironmentVariable("MERCHANT_ACCOUNT"),
      amount,
      reference: `minimal-checkout-${crypto.randomUUID()}`,
      returnUrl,
      countryCode: "FR",
      shopperLocale: "fr-FR",
      channel: Types.checkout.CreateCheckoutSessionRequest.ChannelEnum.Web,
    });

    return NextResponse.json({
      clientKey: getRequiredEnvironmentVariable("NEXT_PUBLIC_CLIENT_KEY"),
      session,
    });
  } catch (error) {
    console.error("Unable to create checkout session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
