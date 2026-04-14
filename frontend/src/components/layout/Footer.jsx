export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">DystoAI</span>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#e0ff4f' }}>
              by Netrunners
            </span>
          </div>

          <p className="text-xs text-zinc-600 text-center">
            Marketplace de Inteligencia Artificial — modelos, prompts y herramientas premium
          </p>

          <span className="text-sm text-zinc-600">
            © {currentYear} Todos los derechos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
