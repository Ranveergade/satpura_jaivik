"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-pale text-forest border border-leaf/40 hover:bg-leaf/10",
    danger: "bg-red text-white hover:bg-red/90",
    ghost: "bg-transparent text-forest border border-secondary/40 hover:bg-pale",
  };
  const sizes = size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-base";

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ invalid, className = "", ...props }: InputProps) {
  const state = invalid
    ? "border-red focus-visible:outline-red"
    : "border-secondary/40 focus-visible:outline-leaf";
  return (
    <input
      className={`h-11 w-full rounded-lg border bg-white px-3 text-base text-ink placeholder:text-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-1 ${state} ${className}`}
      {...props}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ invalid, className = "", ...props }: TextareaProps) {
  const state = invalid
    ? "border-red focus-visible:outline-red"
    : "border-secondary/40 focus-visible:outline-leaf";
  return (
    <textarea
      className={`rounded-lg border bg-white px-3 py-2 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-1 ${state} ${className}`}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function Select({
  invalid,
  className = "",
  children,
  ...props
}: SelectProps) {
  const state = invalid
    ? "border-red focus-visible:outline-red"
    : "border-secondary/40 focus-visible:outline-leaf";
  return (
    <select
      className={`h-11 w-full rounded-lg border bg-white px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-1 ${state} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">{label}</label>
      {children}
      {error ? (
        <p className="text-sm text-red" role="alert">
          {error}
        </p>
      ) : null}
      {required ? (
        <span className="text-xs text-secondary">Required</span>
      ) : null}
    </div>
  );
}

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-secondary/20 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export type BadgeTone = "green" | "amber" | "red" | "blue" | "neutral";

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  const tones: Record<BadgeTone, string> = {
    green: "bg-leaf/15 text-forest",
    amber: "bg-amber/15 text-amber",
    red: "bg-red/10 text-red",
    blue: "bg-blue/10 text-blue",
    neutral: "bg-secondary/10 text-secondary",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) {
  const tones = {
    error: "border-red/40 bg-red/5 text-red",
    success: "border-leaf/40 bg-pale text-forest",
    info: "border-blue/40 bg-blue/5 text-blue",
  };
  return (
    <div
      role="alert"
      className={`rounded-lg border p-3 text-sm ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-sm text-secondary">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      {label ? <span>{label}</span> : <span>Loading…</span>}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-secondary/40 bg-white p-8 text-center">
      <p className="font-medium text-ink">{title}</p>
      {message ? <p className="text-sm text-secondary">{message}</p> : null}
      {action}
    </div>
  );
}
