export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center space-y-8 p-10 border border-border bg-surface rounded-2xl shadow-2xl">

        <h1 className="text-5xl font-bold tracking-tight">
          DystoAI <span className="text-accent font-mono text-sm">by Netrunners</span>
        </h1>

        <p className="text-xl text-text-muted max-w-xl mx-auto">
          Marketplace de inteligencia artificial.
        </p>

        <div className="pt-8 flex flex-col gap-4 font-mono text-sm">
          <div className="bg-background p-4 rounded-lg border border-border flex justify-between items-center">
            <span className="text-text-muted">Estado del Sistema:</span>
            <span className="text-accent flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              En línea
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}