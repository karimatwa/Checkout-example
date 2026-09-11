import CheckoutDropin from "@/components/CheckoutDropin";

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <section className="checkout-card">
        <h1>Checkout</h1>
        <p>Complete your payment securely.</p>
        <CheckoutDropin />
      </section>
    </main>
  );
}
