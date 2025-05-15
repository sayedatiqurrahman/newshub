import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  return format(new Date(date), formatStr);
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function getRandomCategoryColor(): string {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getCategoryColor(index: number): string {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  ];
  
  return colors[index % colors.length];
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'technology': 'ri-computer-line',
    'politics': 'ri-government-line',
    'finance': 'ri-money-dollar-circle-line',
    'lifestyle': 'ri-heart-line',
    'sports': 'ri-basketball-line',
    'health': 'ri-heart-pulse-line',
    'entertainment': 'ri-movie-line',
    'science': 'ri-flask-line',
    'education': 'ri-book-open-line',
    'travel': 'ri-plane-line',
  };
  
  return icons[category.toLowerCase()] || 'ri-price-tag-3-line';
}
