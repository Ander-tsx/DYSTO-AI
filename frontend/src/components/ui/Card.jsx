import React, { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Card = forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900/70 text-zinc-100 shadow-sm",
        className
      )}
      {...props}
    />
  );
});

const CardHeader = forwardRef(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("border-b border-zinc-800 p-5", className)}
      {...props}
    />
  );
});

const CardContent = forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("p-5", className)} {...props} />;
});

const CardFooter = forwardRef(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("border-t border-zinc-800 p-5", className)}
      {...props}
    />
  );
});

export { Card, CardHeader, CardContent, CardFooter };
