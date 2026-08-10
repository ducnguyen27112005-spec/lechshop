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

export function getMessengerLink(url: string) {
    if (!url) return "#";
    
    let processedUrl = url.trim();
    
    // Add https if missing
    if ((processedUrl.includes("facebook.com") || processedUrl.includes("m.me") || processedUrl.includes("messenger.com")) && !processedUrl.startsWith("http")) {
        processedUrl = "https://" + processedUrl;
    }

    const baseUrl = "https://m.me/";

    try {
        const urlObj = new URL(processedUrl);
        
        // Handle m.me/ID
        if (urlObj.hostname.includes("m.me")) {
            const pathParts = urlObj.pathname.split("/").filter(Boolean);
            if (pathParts.length > 0) {
                return `${baseUrl}${pathParts[0]}`;
            }
        }
        
        // Handle facebook.com or messenger.com
        if (urlObj.hostname.includes("facebook.com") || urlObj.hostname.includes("messenger.com")) {
            if (urlObj.searchParams.has("id")) {
                return `${baseUrl}${urlObj.searchParams.get("id")}`;
            }
            const pathParts = urlObj.pathname.split("/").filter(Boolean);
            
            // If url is like facebook.com/messages/t/ID
            if (pathParts.includes("messages") && pathParts.includes("t")) {
                const tIndex = pathParts.indexOf("t");
                if (tIndex + 1 < pathParts.length) {
                    return `${baseUrl}${pathParts[tIndex + 1]}`;
                }
            }
            
            // If url is like facebook.com/ID
            if (pathParts.length > 0) {
                let id = pathParts[0];
                if (id === "profile.php" && urlObj.searchParams.has("id")) {
                    id = urlObj.searchParams.get("id")!;
                }
                return `${baseUrl}${id}`;
            }
        }
    } catch (e) {
        // Ignore URL parsing errors
    }
    
    // If it's just a username/ID without http
    if (!processedUrl.startsWith("http") && !processedUrl.includes("/")) {
        return `${baseUrl}${processedUrl}`;
    }
    
    return processedUrl;
}

