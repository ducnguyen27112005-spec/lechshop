export const routes = {
    home: "/",
    about: "/gioi-thieu",
    aboutUs: "/ve-chung-toi",
    products: "/san-pham",
    pricing: "/bang-gia",
    guides: "/huong-dan",
    news: "/tin-tuc",
    support: "/ho-tro",
    contact: "/lien-he",
    checkout: "/thanh-toan",
    studentDiscount: "/uu-dai-sinh-vien",
} as const;

export type Route = typeof routes[keyof typeof routes];
