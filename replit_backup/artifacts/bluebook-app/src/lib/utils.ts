import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function calculateRisk(likelihood: number, consequence: number) {
  const score = likelihood * consequence;
  if (score <= 4) return { rating: score, level: "low", color: "bg-safety-green text-white" };
  if (score <= 9) return { rating: score, level: "medium", color: "bg-safety-amber text-black" };
  if (score <= 14) return { rating: score, level: "high", color: "bg-safety-orange text-white" };
  return { rating: score, level: "extreme", color: "bg-safety-red text-white" };
}
