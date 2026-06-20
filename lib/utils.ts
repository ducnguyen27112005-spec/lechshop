import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function getDeterministicSoldCount(str: string, category?: string): number {
    const isEntertainment = 
        category?.toLowerCase().includes("giải trí") || 
        str.toLowerCase().includes("netflix") || 
        str.toLowerCase().includes("youtube") || 
        str.toLowerCase().includes("spotify");
        
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash) % 101; // 0 to 100
    
    if (isEntertainment) {
        return 200 + seed; // 200 to 300
    }
    return 100 + seed; // 100 to 200
}
