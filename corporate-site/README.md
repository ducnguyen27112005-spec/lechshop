# TechCorp Corporate Website

A modern corporate website built with Next.js, TypeScript, and Tailwind CSS, showcasing Netflix renewal and ChatGPT Plus upgrade services.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed
- Windows PowerShell or Command Prompt

### Installation & Running

1. **Navigate to the project directory:**
   ```powershell
   cd "D:\website 01\corporate-site"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Run the development server:**
   ```powershell
   npm run dev
   ```

4. **Open your browser:**
   Navigate to **[http://localhost:3001](http://localhost:3001)**

> **Note:** The dev server is configured to always run on port **3001**. If you need auto port selection, use `npm run dev:auto`.


## 📁 Project Structure

```
corporate-site/
├── app/                    # Next.js App Router pages
│   ├── gioi-thieu/        # About page
│   ├── san-pham/          # Products listing & detail
│   ├── bang-gia/          # Pricing page
│   ├── huong-dan/         # Guides page
│   ├── tin-tuc/           # News listing & detail
│   ├── ho-tro/            # Support page
│   ├── lien-he/           # Contact page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # TopBar, Header, Footer, NavMenu
│   ├── home/              # HeroSlider, FeaturedProducts, etc.
│   └── shared/            # Reusable components
├── content/               # Data files (site config, products, posts)
├── lib/                   # Utilities and constants
└── public/                # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start dev server on **port 3001**
- `npm run dev:auto` - Start dev server (auto port selection)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## ✨ Features

- **THACO-inspired corporate design** with professional layout
- **Responsive design** - Mobile, tablet, and desktop friendly
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** icons
- **SEO optimized** with proper meta tags
- **Floating contact bar** with social media links
- **Dynamic routing** for products and news articles

## 📄 Pages

- **Home** (`/`) - Hero slider, featured products, why choose us, news
- **About** (`/gioi-thieu`) - Company information
- **Products** (`/san-pham`) - Service listings
- **Pricing** (`/bang-gia`) - Pricing tables
- **Guides** (`/huong-dan`) - Step-by-step guides
- **News** (`/tin-tuc`) - Blog articles
- **Support** (`/ho-tro`) - FAQ and contact methods
- **Contact** (`/lien-he`) - Contact form and information

## 🎨 Design System

- **Colors:** Blue primary (#2563eb), corporate white background
- **Typography:** Geist Sans & Geist Mono fonts
- **Spacing:** Consistent max-width containers (max-w-7xl)
- **Components:** Card-based layouts with hover effects

## 🔧 Troubleshooting

### Port already in use
```powershell
# Find and kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### Clear cache
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

## 📝 License

Proprietary - TechCorp Services © 2026
