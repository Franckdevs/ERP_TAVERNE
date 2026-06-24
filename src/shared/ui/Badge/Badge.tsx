import type { HTMLAttributes } from "react";
import styles from "./Badge.module.css";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  const cls = [styles.badge, styles[tone], className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}
