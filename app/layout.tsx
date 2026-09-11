import "./globals.css";
import "../src/components/checkout.css";

export const metadata = {
  title: "Checkout",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
