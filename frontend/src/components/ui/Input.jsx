import React, { forwardRef, useId } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Input = forwardRef(function Input(
  { label, error, id, className, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-zinc-200">
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-lg border bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500",
          "focus:outline-none focus:ring-1",
          error
            ? "border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/50"
            : "border-zinc-800 focus:border-emerald-500/70 focus:ring-emerald-500/40",
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
