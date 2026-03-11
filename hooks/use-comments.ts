import { useState, useEffect } from 'react';
import { CommentItem, getComments } from '@/lib/comment-config';

export function useComments(postId?: string) {
    const [comments, setComments] = useState<CommentItem[]>([]);

    useEffect(() => {
        const fetchComments = () => {
            const data = getComments();
            // If postId provided, filter
            if (postId) {
                setComments(data.filter(c => c.postId === postId));
            } else {
                setComments(data);
            }
        };

        fetchComments();

        const handleStorageChange = () => {
            fetchComments();
        };

        window.addEventListener('comments-updated', handleStorageChange);
        window.addEventListener('storage', handleStorageChange); // Cross-tab support

        return () => {
            window.removeEventListener('comments-updated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [postId]);

    return comments;
}
