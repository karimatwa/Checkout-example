import "./globals.css";
import "../src/components/checkout.css";

export const metadata = {
  title: "Checkout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
