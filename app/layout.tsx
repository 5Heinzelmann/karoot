import type { Metadata } from "next";
import { Geist, Baloo_2, Quicksand } from "next/font/google";
import { Fredoka } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth/auth-context";
import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import { CarrotIcon } from "@/components/ui/carrot-icon";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Karoot! - Interactive Quiz Game",
  description: "Create and play interactive quiz games with friends in real-time",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  display: "swap",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  display: "swap",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${baloo2.variable} ${quicksand.variable} ${fredoka.variable} font-body antialiased bg-pattern-carrots`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <header className="w-full p-4 border-b border-carrot-pale bg-card/80 backdrop-blur-sm shadow-carrot">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center gap-2 text-xl font-heading font-bold text-carrot hover:text-carrot-dark transition-colors">
                    <CarrotIcon size={28} />
                    Karoot!
                  </Link>
                  {user && (
                    <nav className="flex gap-4">
                      <Link href="/protected" className="text-sm font-ui text-soil hover:text-carrot hover:underline transition-colors">
                        My Games
                      </Link>
                    </nav>
                  )}
                </div>
                <AuthButton />
              </div>
            </header>
            <main className="page-transition">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
