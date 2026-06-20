export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    planLabel?: string;

    // Service fields
    slug?: string;
    title?: string;
    planId?: string;
    planName?: string;
    unitPrice?: number;
    totalPrice?: number;
    inputValue?: string; // Link/UID
    note?: string;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}
