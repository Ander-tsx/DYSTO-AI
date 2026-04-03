export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-cyan-500/70">DystoAI</span>
            <span className="text-sm text-zinc-500">•</span>
            <span className="text-sm text-zinc-500">Agencia NTR</span>
          </div>

          <span className="text-sm text-zinc-500">
            © {currentYear} Todos los derechos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
