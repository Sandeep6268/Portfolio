# Portfolio — Next.js + MongoDB + Admin Panel

A fully customizable developer portfolio built with **Next.js (App Router)**. Everything on the public site is editable from a built-in **admin panel** — no code changes needed. Media (images & video) is uploaded to **Cloudinary** and auto-optimized (images delivered as **WebP**, videos compressed) for fast loading. Contact-form messages are stored in MongoDB and emailed via **SMTP (Nodemailer)**.

## Features

- **Next.js backend** — all APIs are Next.js route handlers (no separate server).
- **Admin panel** at `/admin` to customize the whole site:
  - Site name, tagline, SEO, footer, favicon
  - Hero (heading, paragraph, CTAs, media, animated stat counters)
  - About, Contact (with editable social links)
  - **Projects** — add/edit/delete with an image **or** video, tech tags & feature lists
  - **Skills** — with customizable icons
  - **Experience / Timeline**, **Services**, **Testimonials**
  - **Theme** — change all colors, font and toggle the smokey cursor / 3D star effects
  - **Sections** — turn any section on/off, rename, and reorder
  - **Messages** — read & manage contact submissions
  - Change admin password & SMTP settings
- **Customizable icons everywhere** — paste a [react-icons](https://react-icons.github.io/react-icons) name (e.g. `SiReact`, `FaGithub`, `FiCode`) **or** an SVG/image URL.
- **Media optimization** — images → WebP, videos → optimized, via Cloudinary.
- Keeps the original **WebGL smokey cursor** and animated **3D star background**.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** — `.env.local` already contains your credentials
   (MongoDB, Cloudinary, SMTP, admin email/password, JWT secret).
   Change `JWT_SECRET` to a long random string before deploying.

3. **Seed the database** (creates the admin account + default content)
   ```bash
   npm run seed
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login

## Admin login

Default credentials come from `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
If you skip the seed step, the first login attempt with the env email/password
bootstraps the admin account automatically. Change the password from
**Admin → Settings** after first login.

## Production

```bash
npm run build
npm run start
```

Deployable to any Node host or Vercel. Set the same environment variables in
your host's dashboard. Media is stored on Cloudinary so uploads persist on
serverless platforms.

## Tech stack

Next.js 14 · React 18 · MongoDB (Mongoose) · Cloudinary · Nodemailer · jose (JWT) ·
Framer Motion · three.js / @react-three/fiber · react-icons.
