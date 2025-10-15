"use client";
import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const base =
    "px-4 py-2 rounded-md font-medium transition transform hover:-translate-y-0.5";
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]",
    secondary: "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-primary)]",
  };

  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
