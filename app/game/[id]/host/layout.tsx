import { AuthCheck } from "./auth-check";
import { AuthButton } from "@/components/auth-button";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck>
      <header className="w-full p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-primary">Karoot!</div>
          <AuthButton />
        </div>
      </header>
      <main>{children}</main>
    </AuthCheck>
  );
}