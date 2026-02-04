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
} as const;

export type Route = typeof routes[keyof typeof routes];
