export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Plateforme Welo
        </p>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight">
          Une plateforme modulaire pour gérer les services, les clients et les opérations des PME.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Welo centralise les rendez-vous, les appels de service, les stocks, les clients et les modules métiers dans une seule interface évolutive.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/dashboard"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
          >
            Accéder au dashboard
          </a>

          <a
            href="/modules"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white"
          >
            Voir les modules
          </a>
        </div>
      </section>
    </main>
  );
}