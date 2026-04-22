import { Outfit, Space_Mono } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext.jsx';

import PropTypes from "prop-types";
import { Toaster } from "react-sileo";
import "react-sileo/styles.css";
import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import "./globals.css";
import { CartProvider } from '@/context/CartContext.jsx';


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
  title: "DystoAI — Marketplace de Inteligencia Artificial",
  description: "Explora modelos, prompts y herramientas de IA listos para integrar en DystoAI Marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${outfit.variable} ${spaceMono.variable} font-sans bg-background text-text-primary antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <CartProvider>
            <Toaster
              theme="dark"
              position="bottom-right"
              options={{
                fill: "#212121ff",
                roundness: 12,
                duration: 4000,
                styles: {
                  title: "font-medium",
                  description: "text-white!",
                  badge: "border border-zinc-700 bg-zinc-800 text-zinc-200",
                },
              }}
            />
            <Navbar />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};
