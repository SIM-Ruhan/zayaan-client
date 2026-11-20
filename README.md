# Poshak – Frontend (Next.js JS + Tailwind + Framer Motion)

## Run locally
```
cp .env.example .env.local   # BACKEND_URL=http://localhost:8000
npm install
npm run dev                  # http://localhost:3000
```

## Deploy (Vercel)
Import this folder, add env `BACKEND_URL` = your backend Vercel URL. Done.

`/api/*` is proxied to the backend (see `next.config.mjs`) so login cookies stay first-party.

## Pages
`/` home · `/all-products` (search + filters) · `/products/[id]` · `/checkout` · `/payment/success|fail`
`/login` `/register` · `/dashboard` (user) · `/admin` (admin) · `/lp/[slug]` (ad landing pages)

Banner images live in `public/banners/` (men.jpg, women.jpg, kids.jpg). The brand name “Poshak” is in `components/Navbar.js` and `Footer.js`.
