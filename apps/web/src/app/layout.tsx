import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "KRISHI-EYE Platform",
  description: "Farm intelligence and automated advisory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased text-white bg-[#0F1115] overflow-hidden`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
