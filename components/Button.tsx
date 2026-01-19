"use client";

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-900 disabled:bg-zinc-400",
  secondary:
    "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 disabled:text-zinc-400",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:bg-red-600 disabled:bg-red-300",
};

export function Button({
  className = "",
  variant = "primary",
  fullWidth = true,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "h-12",
        fullWidth ? "w-full" : "w-auto",
        "rounded-xl px-4 font-semibold",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed",
        variantClasses[variant],
        className,
      ].join(" ")}
    />
  );
}

