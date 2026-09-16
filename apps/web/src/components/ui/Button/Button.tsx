import { Link } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Button.css";

type ButtonProps =
  | ({
      to: string;
      children: ReactNode;
      variant?: "primary" | "secondary";
    } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">)
  | ({
      to?: undefined;
      children: ReactNode;
      variant?: "primary" | "secondary";
    } & ButtonHTMLAttributes<HTMLButtonElement>);

export default function Button({
  children,
  variant = "primary",
  className = "",
  to,
  ...props
}: ButtonProps) {
  const classes = `button button--${variant} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}