"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { products, premiumProducts, socialServices } from "@/content/products";
import { getProductsConfig, fetchProductsConfig, ProductConfig } from "@/lib/product-config";

interface SearchResult {
    id: string;
    slug: string;
    title: string;
    type: "product" | "service";
    price?: string;
    image?: string;
}

interface SearchBarProps {
    placeholder?: string;
}

export default function SearchBar({
    placeholder = "Tìm kiếm tài khoản, khoá học, phần mềm..."
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [adminProducts, setAdminProducts] = useState<ProductConfig[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load admin products from server
    useEffect(() => {
        const loadAdminProducts = () => {
            const config = getProductsConfig();
            setAdminProducts(config.products || []);
        };
        fetchProductsConfig().then(loadAdminProducts);
        window.addEventListener("products-config-updated", loadAdminProducts);
        return () => {
            window.removeEventListener("products-config-updated", loadAdminProducts);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search when query changes
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const found: SearchResult[] = [];
        const seenSlugs = new Set<string>();

        // Search in admin products first (source of truth)
        adminProducts.forEach((p) => {
            if (p.name.toLowerCase().includes(searchTerm)) {
                seenSlugs.add(p.slug);
                const lowestPrice = p.plans.length > 0
                    ? Math.min(...p.plans.map(pl => pl.price))
                    : 0;
                found.push({
                    id: p.id,
                    slug: p.slug,
                    title: p.name,
                    type: "product",
                    price: lowestPrice > 0 ? lowestPrice.toLocaleString("vi-VN") + "đ" : undefined,
                    image: p.image,
                });
            }
        });

        // Search in hardcoded products (skip if already found from admin)
        products.forEach((p) => {
            if (!seenSlugs.has(p.slug) && p.name.toLowerCase().includes(searchTerm)) {
                seenSlugs.add(p.slug);
                found.push({
                    id: p.id,
                    slug: p.slug,
                    title: p.name,
                    type: "product",
                    price: p.pricing[0]?.price,
                    image: p.image,
                });
            }
        });

        // Search in premium products (skip if already found)
        premiumProducts.forEach((p) => {
            if (!seenSlugs.has(p.slug) && p.title.toLowerCase().includes(searchTerm)) {
                seenSlugs.add(p.slug);
                found.push({
                    id: p.id,
                    slug: p.slug,
                    title: p.title,
                    type: "product",
                    price: p.startingPrice,
                    image: p.image,
                });
            }
        });

        // Search in social services
        socialServices.forEach((s) => {
            if (s.title.toLowerCase().includes(searchTerm)) {
                found.push({
                    id: s.id,
                    slug: s.id,
                    title: s.title,
                    type: "service",
                    image: s.image,
                });
            }
        });

        setResults(found.slice(0, 8));
        setIsOpen(found.length > 0 || query.length >= 2);
    }, [query, adminProducts]);

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="flex-1 max-w-xl w-full mx-auto relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full h-12 pl-5 pr-24 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md transition-shadow focus:shadow-lg"
                />
                <div className="absolute right-2 top-0 h-12 flex items-center gap-2">
                    {query && (
                        <button
                            onClick={clearSearch}
                            className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                    <button
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label="Search"
                    >
                        <Search className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                    {results.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {results.map((result) => (
                                <li key={result.id}>
                                    <Link
                                        href={`/san-pham/${result.slug}`}
                                        onClick={() => {
                                            setIsOpen(false);
                                            setQuery("");
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                                    >
                                        {result.image && (
                                            <img
                                                src={result.image}
                                                alt={result.title}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{result.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {result.type === "product" ? "Sản phẩm Premium" : "Dịch vụ MXH"}
                                            </p>
                                        </div>
                                        {result.price && (
                                            <span className="text-sm font-semibold text-blue-600">
                                                {result.price}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p>Không tìm thấy sản phẩm "{query}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
