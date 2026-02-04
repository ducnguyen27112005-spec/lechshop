# TechCorp Corporate Website & CMS

This project consists of a Next.js frontend and a Strapi CMS backend.

## Project Structure

- `corporate-site/`: Next.js frontend application (React, Tailwind, TypeScript).
- `cms/`: Strapi CMS backend application (Node.js, SQLite).

## Running the Project

To run the full setup locally, you need two terminal windows:

### 1. Start Strapi CMS (Backend)
```bash
cd cms
npm install
npm run develop
```
- Admin panel: [http://localhost:1337/admin](http://localhost:1337/admin)
- Create your admin user on the first run.
- Set **Public** permissions in Settings > Roles > Public:
  - `Customer-request`: Enable **create**
  - `Post`: Enable **find** and **findOne**
  - `Site-setting`: Enable **find**
  - `Hero-slide`: Enable **find**
  - `Premium-product`: Enable **find**
  - `Social-service`: Enable **find**

### 2. Start Next.js (Frontend)
```bash
cd corporate-site
npm install
npm run dev
```
- Website: [http://localhost:3000](http://localhost:3000) (or whichever port is assigned)

## Troubleshooting Port Conflicts

If you see an error like `EADDRINUSE: address already in use :::3001`:

### 1. Free Port 3001 (Windows)
Open PowerShell and run:
```powershell
# Find the PID
netstat -ano | findstr :3001
# Kill the process (replace PID with the number from the last column)
taskkill /F /PID <PID>
```

### 2. Run on a Different Port
If you prefer to use a different port (e.g., 3002):
```bash
npx next dev -p 3002
```

## Important Notes
- The frontend will require `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337` in `.env.local` (to be configured in next steps).
- Content management (banner, products, services, posts) is handled via Strapi.
- Service requests from users will appear in the Strapi admin under "Customer Requests".
