import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fredoka } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth/auth-context";
import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Karoot! - The real-time multiplayer quiz",
  description: "Plant some questions, harvest lots of fun!"
};

const fredoka = Fredoka({
  variable: "--font-fredoka",
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      <body className={`${fredoka.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <header className="w-full p-4 border-b">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-xl font-bold text-primary">
                    Karoot!
                  </Link>
                  {user && (
                    <nav className="flex gap-4">
                      <Link href="/protected" className="text-sm hover:underline">
                        My Games
                      </Link>
                    </nav>
                  )}
                </div>
                <AuthButton />
              </div>
            </header>
            <main>
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
