import Link from "next/link";
import PropTypes from "prop-types";
import Button from "../ui/Button";

export default function Topbar({
  brand,
  brandHref,
  navLinks,
  actionLabel,
  actionVariant,
  actionSize,
  actionClassName,
  onAction,
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={brandHref}
          className="shrink-0 text-lg font-semibold tracking-tight text-zinc-100"
        >
          {brand}
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

        {actionLabel ? (
          <Button
            variant={actionVariant}
            size={actionSize}
            className={actionClassName}
            onClick={onAction}
            type="button"
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </header>
  );
}

Topbar.propTypes = {
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
};

Topbar.defaultProps = {
  brand: "DystoAI",
  brandHref: "/",
  navLinks: [],
  actionLabel: "",
  actionVariant: "ghost",
  actionSize: "sm",
  actionClassName:
    "ml-auto md:ml-6 border-zinc-700 text-zinc-200 hover:border-zinc-600 hover:text-cyan-300",
  onAction: undefined,
};
