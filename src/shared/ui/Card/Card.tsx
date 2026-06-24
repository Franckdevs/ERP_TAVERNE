import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  /** Contenu aligné à droite de l'en-tête (actions, filtres…). */
  action?: ReactNode;
}

export function Card({ title, action, className, children, ...rest }: CardProps) {
  const cls = [styles.card, className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      {(title || action) && (
        <div className={styles.head}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
