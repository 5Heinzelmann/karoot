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
    <div className="flex-1 w-full flex flex-col bg-pattern-carrots min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-carrot-lg border border-carrot-pale p-6">
          <GamesList />
        </div>
      </div>
    </div>
  );
}
