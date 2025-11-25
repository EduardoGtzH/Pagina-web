import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "HabitFlow",
  description: "Tu asistente personal de hábitos",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-bgDark text-textLight">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
