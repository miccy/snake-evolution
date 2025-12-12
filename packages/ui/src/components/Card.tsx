import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Card({ children, title, description, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {(title || description) && <div className="mt-4">{children}</div>}
      {!title && !description && children}
    </div>
  );
}
