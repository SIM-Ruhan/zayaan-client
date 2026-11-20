import "./globals.css";
import Providers from "@/components/Providers";
import Chrome from "@/components/Chrome";

export const metadata = {
  title: "Poshak — Clothing for the whole family",
  description: "Festive, daily and seasonal wear for men, women and kids. Delivered across Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers><Chrome>{children}</Chrome></Providers>
      </body>
    </html>
  );
}
