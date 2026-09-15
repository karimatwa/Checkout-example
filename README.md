# Sarenza Checkout

A minimal, standalone Adyen Checkout Drop-in for Sarenza. The app creates an Adyen Checkout session on the server, then mounts Card and PayPal payment components in the browser.

## Run locally

From the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To use a different port:

```bash
npm run dev -- --port 3003
```

## Configuration

The app loads only the repository-root `.env` file. It must contain:

```env
API_KEY=your-adyen-checkout-api-key
MERCHANT_ACCOUNT=your-adyen-merchant-account
NEXT_PUBLIC_CLIENT_KEY=your-adyen-client-key
```

Do not commit `.env` or share its values. `API_KEY` stays on the server. The client key is returned only as part of the checkout session initialization response.

## Payment methods

The Drop-in explicitly registers:

- Card
- PayPal

Payment methods appear only when they are enabled and eligible for the configured Adyen merchant account, shopper country, currency, and payment amount. Enable PayPal for the Sarenza merchant account in the Adyen Customer Area before testing it.

## How it works

1. `app/page.js` renders the checkout page.
2. `src/components/CheckoutDropin.js` requests a session from `POST /api/sessions`.
3. `app/api/sessions/route.js` loads `.env` and calls Adyen's Checkout Sessions API with a fixed EUR 10.00 amount.
4. The browser initializes Adyen Drop-in with the returned session and client key.

The server generates a unique payment reference for every session. The API response contains only the Adyen session and client key required by the Drop-in. It never exposes the API key.

## Validate

```bash
npm run lint
npm run build
```
