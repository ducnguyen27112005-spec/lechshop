"use client";

import { posts as defaultPosts, Post } from "@/content/posts";

export type { Post };

const BLOG_STORAGE_KEY = "blog_posts";

export const defaultBlogPosts: Post[] = defaultPosts;

export function getBlogPosts(): Post[] {
    if (typeof window === "undefined") return defaultBlogPosts;

    try {
        const stored = localStorage.getItem(BLOG_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with default posts if needed, or just return stored.
            // For simplicity and full control, we return stored (which should include defaults if initialized)
            // But if storage is empty, we initialize it.
            return parsed.length > 0 ? parsed : defaultBlogPosts;
        }
    } catch (e) {
        console.error("Failed to load blog posts", e);
    }
    return defaultBlogPosts;
}

export function saveBlogPosts(posts: Post[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
        window.dispatchEvent(new Event("blog-posts-changed"));
    } catch (e) {
        console.error("Failed to save blog posts", e);
    }
}

export function getBlogPostBySlug(slug: string): Post | undefined {
    const posts = getBlogPosts();
    return posts.find((p) => p.slug === slug);
}

// Initialize storage if empty
if (typeof window !== "undefined") {
    const stored = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(defaultBlogPosts));
    }
}
