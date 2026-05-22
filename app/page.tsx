import { supabase } from "../src/lib/supabase.ts";

export default async function Home() {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Plateforme Welo
      </h1>

      <pre className="mt-6">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}