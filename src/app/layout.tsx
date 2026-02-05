import type { Metadata } from "next";
import "./globals.css";
import { ViewProvider } from "../contexts/ViewContext";

export const metadata: Metadata = {
  title: "Tweet Feed",
  description: "Saved tweets feed viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        <ViewProvider>{children}</ViewProvider>
      </body>
    </html>
  );
}
