import { useState, useEffect } from "react";
import { Post } from "@/content/posts";

export function useBlogPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/blog/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();

        // Listen for internal changes (like admin updates if same window)
        const handleChange = () => fetchPosts();
        window.addEventListener("blog-posts-changed", handleChange);
        return () => window.removeEventListener("blog-posts-changed", handleChange);
    }, []);

    return posts;
}

export function useBlogPost(slug: string) {
    const posts = useBlogPosts();
    return posts.find((p) => p.slug === slug);
}
