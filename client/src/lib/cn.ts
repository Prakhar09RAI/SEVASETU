import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx class definitions with tailwind-merge to avoid conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export default cn;
