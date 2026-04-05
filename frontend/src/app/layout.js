import { Outfit, Space_Mono } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext';
import PropTypes from "prop-types";
import { Toaster } from "react-sileo";
import "react-sileo/styles.css";
import Footer from "../components/layout/Footer";
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
  title: "DystoAI",
  description: "MarketPlace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${outfit.variable} ${spaceMono.variable} font-sans bg-background text-text-primary antialiased min-h-screen`}
      >
        <AuthProvider>
          <Toaster
            theme="dark"
            position="bottom-right"
            options={{
              fill: "#09090b",
              roundness: 12,
              duration: 4000,
              styles: {
                title: "text-zinc-100",
                description: "text-zinc-300",
                badge: "border border-zinc-700 bg-zinc-800 text-zinc-200",
              },
            }}
          />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};