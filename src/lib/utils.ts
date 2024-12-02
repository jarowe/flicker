import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeLeft(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function calculateLifespanExtension(
  type: 'view' | 'comment' | 'reaction' | 'authentic',
  isAuthentic: boolean = false
): number {
  const baseExtensions = {
    view: 5,
    comment: 30,
    reaction: 15,
    authentic: 45,
  }

  const multiplier = isAuthentic ? 1.5 : 1
  return Math.floor(baseExtensions[type] * multiplier)
}

export function formatKarma(karma: number): string {
  if (karma < 1000) {
    return karma.toString()
  }
  if (karma < 1000000) {
    return `${(karma / 1000).toFixed(1)}K`
  }
  return `${(karma / 1000000).toFixed(1)}M`
}
