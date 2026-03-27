import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata = {
  title: "DystoAI Frontend",
  description: "Inicialización del frontend con Next.js y Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${outfit.variable} ${spaceMono.variable} font-sans bg-background text-text-primary antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}