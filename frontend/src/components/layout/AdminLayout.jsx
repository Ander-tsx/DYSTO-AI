import Link from "next/link";
import PropTypes from "prop-types";
import Button from "../ui/Button";

const navLinks = [
  { label: "Productos", href: "/admin/productos" },
  { label: "Usuarios", href: "/admin/usuarios" },
  { label: "Configuracion", href: "/admin/configuracion" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="shrink-0 text-lg font-semibold tracking-tight text-zinc-100"
          >
            DystoAI Admin
          </Link>

          <nav className="ml-auto hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-300 transition-colors hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="ml-auto md:ml-6 border-zinc-700 text-zinc-200 hover:border-zinc-600 hover:text-cyan-300"
          >
            Cerrar sesion
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8 lg:pb-12 lg:pt-24">
        {children}
      </main>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
};
