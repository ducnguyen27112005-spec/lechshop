

export interface CommentItem {
    id: string;
    postId: string; // The ID of the blog post
    postTitle?: string; // Optional snapshot of the post title for easier display
    postSlug?: string; // Optional snapshot of the post slug
    name: string;
    email?: string;
    content: string;
    date: string;
    isAdmin: boolean;
    isApproved: boolean; // For moderation
}

const STORAGE_KEY = "lecshop_comments";

// Initial mock data
const INITIAL_COMMENTS: CommentItem[] = [
    {
        id: "1",
        postId: "mock-post-id",
        name: "Admin",
        content: "Cảm ơn bạn đã quan tâm! Nếu cần hỗ trợ thêm hãy liên hệ shop nhé.",
        date: "14/02/2026",
        isAdmin: true,
        isApproved: true,
    },
    {
        id: "2",
        postId: "mock-post-id",
        name: "Nguyễn Văn A",
        content: "Bài viết rất hữu ích ch!",
        date: "14/02/2026",
        isAdmin: false,
        isApproved: true,
    }
];

export function getComments(postId?: string): CommentItem[] {
    if (typeof window === "undefined") return [];

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        let comments: CommentItem[] = raw ? JSON.parse(raw) : [];

        // If data is empty and we want some initial mock data for demo
        if (comments.length === 0 && !raw) {
            // But we don't know real post IDs. So maybe just return empty or generic
            // Let's return empty to be clean.
            comments = [];
        }

        if (postId) {
            return comments.filter(c => c.postId === postId);
        }

        // Sort by date new -> old?
        // For now just return raw
        return comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
        console.error("Error fetching comments", e);
        return [];
    }
}

export function saveComment(comment: Omit<CommentItem, 'id' | 'date' | 'isApproved'>): CommentItem {
    const comments = getComments(); // Gets all

    // Create new comment object
    const newComment: CommentItem = {
        ...comment,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleDateString('vi-VN'),
        isApproved: true, // Auto-approve for now
    };

    const updatedComments = [newComment, ...comments];

    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComments));
        // Dispatch event for reactive updates
        window.dispatchEvent(new Event("comments-updated"));
    }

    return newComment;
}

export function deleteComment(id: string): void {
    const comments = getComments();
    const updated = comments.filter(c => c.id !== id);
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("comments-updated"));
    }
}

export function toggleApproval(id: string): void {
    const comments = getComments();
    const updated = comments.map(c =>
        c.id === id ? { ...c, isApproved: !c.isApproved } : c
    );
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("comments-updated"));
    }
}
