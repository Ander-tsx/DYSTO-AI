import PropTypes from "prop-types";
import Topbar from "./Topbar";

const navLinks = [
  { label: "Productos", href: "/admin/productos" },
  { label: "Usuarios", href: "/admin/usuarios" },
  { label: "Perfil", href: "/admin/perfil" },
];

const defaultTopbar = {
  brand: "DystoAI Admin",
  brandHref: "/admin",
  navLinks,
  actionLabel: "Cerrar sesion",
  actionVariant: "ghost",
  actionSize: "sm",
  actionClassName:
    "ml-auto md:ml-6 border-zinc-700 text-zinc-200 hover:border-zinc-600 hover:text-cyan-300",
};

export default function AdminLayout({ children, topbar }) {
  const topbarConfig = {
    ...defaultTopbar,
    ...topbar,
    navLinks: topbar?.navLinks ?? defaultTopbar.navLinks,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Topbar {...topbarConfig} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8 lg:pb-12 lg:pt-24">
        {children}
      </main>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
  topbar: PropTypes.shape({
    brand: PropTypes.string,
    brandHref: PropTypes.string,
    navLinks: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      })
    ),
    actionLabel: PropTypes.string,
    actionVariant: PropTypes.string,
    actionSize: PropTypes.string,
    actionClassName: PropTypes.string,
    onAction: PropTypes.func,
  }),
};

AdminLayout.defaultProps = {
  topbar: undefined,
};
