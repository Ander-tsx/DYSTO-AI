import PropTypes from "prop-types";

const variantClasses = {
  success: "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  warning: "border border-amber-500/30 bg-amber-500/15 text-amber-300",
  error: "border border-rose-500/30 bg-rose-500/15 text-rose-300",
  info: "border border-sky-500/30 bg-sky-500/15 text-sky-300",
  "ai-generated":
    "border border-cyan-400/50 bg-gradient-to-r from-violet-500/20 to-cyan-400/20 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.18)]",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ variant = "info", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantClasses[variant] || variantClasses.info,
        className
      )}
      {...props}
    />
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf(["success", "warning", "error", "info", "ai-generated"]),
  className: PropTypes.string,
};

export default Badge;
