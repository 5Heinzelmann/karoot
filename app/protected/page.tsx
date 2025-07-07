import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GamesList } from "@/components/games-list";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <GamesList />
    </div>
  );
}
