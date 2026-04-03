import { forwardRef } from "react";

const variantClasses = {
  primary:
    "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 focus-visible:ring-emerald-500/50",
  secondary:
    "bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 focus-visible:ring-zinc-500/40",
  danger:
    "bg-rose-500 text-white hover:bg-rose-400 focus-visible:ring-rose-500/50",
  ghost:
    "bg-transparent text-zinc-200 border border-zinc-800 hover:bg-zinc-900/80 focus-visible:ring-zinc-500/40",
  "ai-action":
    "bg-gradient-to-r from-violet-500 to-cyan-400 text-zinc-950 shadow-[0_0_18px_rgba(34,211,238,0.2)] hover:from-violet-400 hover:to-cyan-300 focus-visible:ring-cyan-400/60",
};

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    className,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      {...props}
    />
  );
});

export default Button;
