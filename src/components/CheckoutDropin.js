"use client";

import { useEffect, useRef, useState } from "react";
import { AdyenCheckout, Card, Dropin, PayPal } from "@adyen/adyen-web";

export default function CheckoutDropin() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    let dropin;

    async function initialiseCheckout() {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ returnUrl: window.location.origin }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to initialise checkout");
        }

        const checkout = await AdyenCheckout({
          clientKey: data.clientKey,
          environment: "test",
          countryCode: "FR",
          session: {
            id: data.session.id,
            sessionData: data.session.sessionData,
          },
        });

        if (active && containerRef.current) {
          dropin = new Dropin(checkout, {
            paymentMethodComponents: [Card, PayPal],
          }).mount(containerRef.current);
        }
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : "Unable to initialise checkout");
        }
      }
    }

    initialiseCheckout();

    return () => {
      active = false;
      dropin?.unmount();
    };
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return <div ref={containerRef} />;
}
