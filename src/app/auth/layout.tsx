import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "SIST Yola · Login",
  description: "Secure login for SIST Yola school system"
};

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        {children}
      </body>
    </html>
  );
}
