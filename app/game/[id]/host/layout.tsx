import { AuthCheck } from "./auth-check";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}