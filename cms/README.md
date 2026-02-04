# Strapi CMS - TechCorp Service

This is the Strapi backend for managing content for the TechCorp corporate website.

## Setup & Running

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run develop
   ```
   The admin panel will be available at: [http://localhost:1337/admin](http://localhost:1337/admin)

3. **Create Admin Account**:
   On the first run, you will be prompted to create your administrator account.

## Content Management

### Content Types
- **Site Settings** (Single Type): Global site configuration (hotline, social links, address).
- **Hero Slides** (Collection): Manage the homepage banner slides.
- **Premium Products** (Collection): Manage products like ChatGPT Plus, Netflix Premium.
- **Social Services** (Collection): Manage social media growth services.
- **Posts** (Collection): Manage news/blog articles.
- **Customer Requests** (Collection): View and manage service requests from users.

### Permissions
To allow the Next.js frontend to read data, you MUST configure public permissions:
1. Go to **Settings** > **Users & Permissions Plugin** > **Roles**.
2. Click on the **Public** role.
3. Under **Permissions**, find each content type and check:
   - `find` and `findOne` for all except `customer-request`.
   - For `customer-request`, check **ONLY** `create`.
4. Click **Save**.

## Data Seeding Guide (Manual)

### 1. Hero Slides
Create 3 slides with background images:
- Title: "Hỗ trợ đăng ký ChatGPT Plus", Button: "Xem chi tiết", Path: "/#premium"
- Title: "Nâng cấp Netflix Premium", Button: "Khám phá ngay", Path: "/#premium"
- Title: "Tăng trưởng Mạng xã hội", Button: "Bắt đầu ngay", Path: "/#dich-vu"

### 2. Premium Products
Create products like Netflix, ChatGPT, Youtube Premium.
Add bullets for each:
- `["Chính hãng 100%", "Bảo hành trọn đời", "Hỗ trợ 24/7"]`

### 3. Social Services
Create services for TikTok, Facebook, Instagram.
Add bullets for each:
- `["Tương tác thật", "An toàn tài khoản", "Tốc độ nhanh"]`

### 4. Posts
Add 3 test posts with titles, excerpts, and rich text content.
