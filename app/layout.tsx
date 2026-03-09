import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Pain Tracker - Registro de Dolor Corporal",
  description:
    "Aplicación para registrar y analizar el dolor corporal y sus patrones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Navigation />
        {/* Main content area — offset for desktop sidebar and mobile top/bottom bars */}
        <main className="md:ml-56 min-h-screen bg-slate-50 pt-14 pb-20 md:pt-0 md:pb-0">
          <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
        </main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
