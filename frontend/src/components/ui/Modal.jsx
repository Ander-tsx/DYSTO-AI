import PropTypes from "prop-types";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Cerrar modal"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl"
      >
        <header className="flex items-center justify-between px-5 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-zinc-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:text-zinc-100"
            aria-label="Cerrar modal"
          >
            X
          </button>
        </header>

        <div className="p-5 text-zinc-200">{children}</div>

        {footer ? <footer className="p-5">{footer}</footer> : null}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  footer: PropTypes.node,
};
