# Foreum 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> A powerful, modern forum platform built with React, TanStack Router, tRPC, and Drizzle ORM — designed for both developers and community managers.

## 🌟 Why Foreum?

Foreum is your all-in-one solution for building engaging community spaces. Whether you're creating a product support forum, an internal discussion board, or a vibrant community platform, Foreum provides everything you need out of the box:

- 🔒 **Enterprise-grade Authentication** with Better Auth
- 🎨 **Beautiful UI** powered by shadcn/ui components
- 🚄 **Lightning-fast Performance** with React and TanStack Router
- 🔧 **Type-safe Backend** using tRPC and Drizzle ORM
- 📱 **Responsive Design** for all devices
- 🌓 **Dark/Light Themes** built-in, also customizable in admin section

## 📚 Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Self-Hosted Installation

Foreum can be deployed on any platform that supports Node.js. Choose your preferred deployment method:

### System Requirements

- Node.js 18 or later
- PostgreSQL 15 or later
- SMTP server for email notifications (or Resend API key)
- 1GB RAM minimum (2GB recommended)
- 10GB storage space

### Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Random string for auth encryption (`openssl rand -hex 32`) |
| `RESEND_API_KEY` | For email | Resend API key for sending emails |
| `BETTER_AUTH_EMAIL` | For email | From address for outgoing emails |
| `GOOGLE_CLIENT_ID` | For Google auth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google auth | Google OAuth client secret |
| `DISCORD_CLIENT_ID` | For Discord auth | Discord OAuth client ID |
| `DISCORD_CLIENT_SECRET` | For Discord auth | Discord OAuth client secret |
| `BASE_URL` | Yes | Public URL of your forum (e.g. `https://forum.example.com`) |
| `TRUSTED_ORIGINS` | For multi-domain | Comma-separated allowed CORS origins (default: `http://localhost:3000`) |

### 🐳 Docker Compose (Recommended)

```bash
# Clone and enter the directory
git clone https://github.com/abdulkareemoj/foreum.git
cd foreum

# Configure your domain in docker-compose.yml and Caddyfile
# Set your domain in Caddyfile (replace forum.yourdomain.com)

# Start everything
docker compose up -d

# Run database migrations (first time only)
docker compose run --rm app pnpm db:push -- --force

# The app will be available at https://forum.yourdomain.com
```

The included `docker-compose.yml` bundles:
- **app** — Foreum server (port 3000)
- **db** — PostgreSQL 17
- **caddy** — Automatic TLS via Let's Encrypt, reverse proxy

### 🐳 Docker (Standalone)

```bash
# Build the image
docker build -t foreum .

# Run with external Postgres
docker run -d -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/foreum" \
  -e BETTER_AUTH_SECRET="your-secret" \
  -e BASE_URL="https://forum.example.com" \
  -e RESEND_API_KEY="re_..." \
  -e BETTER_AUTH_EMAIL="noreply@example.com" \
  foreum

# Run migrations
docker exec <container-id> pnpm db:push -- --force
```

### 💻 Manual Installation (VPS / Bare Metal)

```bash
# Clone the repository
git clone https://github.com/abdulkareemoj/foreum.git
cd foreum

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your database and auth settings

# Run migrations
pnpm db:push -- --force

# Build and start
pnpm build
pnpm start
```

#### Process Management (PM2)

```bash
npm install -g pm2
pm2 start npm --name "foreum" -- start
pm2 save
pm2 startup
```

#### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name forum.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then set up Certbot for TLS:
```bash
sudo certbot --nginx -d forum.yourdomain.com
```

### ☁️ Cloud Platforms

Foreum (Nitro) supports multiple deployment presets. Add to `vite.config.ts`:

```ts
nitro({
  preset: 'vercel',    // or 'cloudflare-pages', 'netlify', 'railway'
}),
```

**Supported presets:** `node-server` (default), `vercel`, `netlify`, `cloudflare-pages`, `railway`, `render-com`, `fly`, `aws-lambda`

> **Note:** Serverless platforms require a PostgreSQL provider like Neon or Supabase. File uploads use UploadThing (works on serverless).

## Features

### Core Features

- 🔐 **Advanced Authentication**
  - Email/Password with username support
  - Email verification & password reset
  - OAuth/SSO integration ready

- 📝 **Rich Discussion Tools**
  - Markdown/Rich text editor
  - Thread categories and tags
  - Upvotes and reactions
  - File attachments

- 👥 **User Management**
  - Customizable profiles
  - Role-based permissions
  - Moderation tools
  - Activity tracking

### Technical Features

- ⚡ **Performance-First Architecture**
  - Server-side rendering with React and TanStack Router
  - Type-safe APIs with tRPC
  - Efficient database queries with Drizzle ORM

- **Modern UI/UX** Responsive design with customizable Dark/light themes and Loading states & animations

- **Modern stack**: React + TanStack Router + tRPC + Drizzle + Better Auth, great DX and strong type-safety across the stack.
  - **Plug-and-play authentication**: email/password with optional username support, email OTP for verification and reset flows, and social sign-in support hooks.
  - **User profiles & settings**: per-user settings (theme, privacy, notification preferences) with Drizzle schemas and a router to manage them.
  - **Bookmarks & Notifications**: built-in systems with pagination/infinite scroll and server-side routers.
  - **Excellent UX**: skeleton loaders, mobile-friendly navbar that collapses sidebars into a single sheet, avatar uploader, toast + alert patterns for different message types.
  - **Extensible design**: clearly split components (LeftSidebar, Mainbar, RightSidebar, ThreadCard, etc.) to make adding features easy and localized.
  - **Open-source friendly**: intentionally readable code, helpful comments and a focus on community contribution.

## Use Cases

Foreum can be used for:

- A public community forum (product support, hobbyist communities, fan clubs).
- Internal company discussion board or knowledge-sharing hub.
- A feature-rich comment + discussion layer for an existing app.
- An MVP for social/community features when validating product-market fit.
- A teaching template for modern full-stack React + TanStack Router + tRPC apps.

## Local Development

> The instructions below assume you have Node.js (v18+) and a Postgres database ready. Adjust package manager (npm / pnpm / yarn) as you prefer.

1. **Clone the repo**

   ```bash
   git clone https://your-repo-url/foreum.git
   cd foreum
   ```

2. **Install dependencies**

   ```bash
   npm install

   # or

   npm install
   ```

3. **Environment**
   Create a `.env` (copy `.env.example` if present) and set the important variables:

   ```env
   DATABASE_URL=postgres://user:pass@localhost:5432/foreum
   VITE_PUBLIC_BASE_URL=http://localhost:5173
   BETTER_AUTH_SECRET=some-super-secret
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=...
   SMTP_PASS=...
   ```

4. **Database migrations & schema**
   If you use Drizzle migrations or Better Auth CLI, run the migration commands needed to create tables (users, accounts, sessions, profile, settings, bookmarks, notifications, etc.). Example command placeholders:

   ```bash

   # Drizzle (if configured)

   npx drizzle-kit generate:migration
   npx drizzle-kit migrate

   # If using Better Auth CLI for plugin migrations

   npx @better-auth/cli migrate
   ```

   (Adjust according to your setup — Foreum includes Drizzle schema files for auth, profile, settings, bookmark, notification, etc.)

5. **Run the dev server**

   ```bash
   npm run dev

   # typically runs the React development server with Vite

   ```

6. **Open the app**
   Visit `http://localhost:5173` (or whatever your Vite server prints) and explore.

## Usage

### Quick Start Guide

1. Set up your environment variables in `.env`:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/foreum
   BETTER_AUTH_SECRET=your-secret-key
   SMTP_HOST=your-smtp-host
   ```

2. Create your first admin user:

   ```bash
   pnpm create-admin
   ```

3. Start customizing your forum:
   - Modify themes in `src/lib/styles`
   - Configure authentication in `src/lib/auth`
   - Add new features through the modular router system

### Development Commands

```bash
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm preview     # Preview production build
pnpm test        # Run tests
pnpm lint        # Run linters
```

### Quick notes

- Authentication flows: sign up/sign in, verify email (via link or OTP), forgot-password (OTP or reset link) are included in UI and wired into Better Auth client APIs.
- Frontend forms use React Hook Form with `zod` schemas for validation and client-server parity.
- TRPC routers live under `src/server/trpc/routers` and are intended to be small, single-responsibility units (threads, category, tag, user, bookmarks, notifications, settings).

## Contribution Guidelines

We’d love your help — whether you’re filing issues, suggesting features, contributing code, or improving docs!

### How to contribute

1. Fork the repo and create a branch for your change.
2. Write clear, focused commits and include tests where possible.
3. Open a PR with a description of your changes and the motivation.
4. Be responsive to review comments — we aim for respectful, constructive reviews.

### Code style & PR tips

- Keep UI and logic separated (components vs. stores/services).
- Use the existing `zod` schemas and `trpc` procedures when adding features to maintain consistency.
- If you add DB schema changes, include a migration and update any seed/mock data.
- Add or update documentation for any new features.

### Reporting bugs & feature requests

Please open an issue — include steps to reproduce, expected vs actual behavior, and (if possible) a minimal repro.

### Code of conduct

We’re committed to fostering a welcoming community. Please follow a friendly and respectful tone in all interactions.

## Contributing

### Ways to Contribute

- Report bugs and suggest features
- Improve documentation
- Submit pull requests
- Share your success stories
- Help others in discussions

### Development Process

1. Fork and clone the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Push to your fork
6. Submit a pull request

## Security

- Configure environment variables properly in production
- Use secure authentication settings
- Follow security best practices for file uploads
- Keep dependencies updated

## Roadmap

Prioritized gaps vs. Discourse, based on cost of delay and architectural impact:

### Tier 1 — Do soon, cheap now, expensive later

| Item | Status | Notes |
|------|--------|-------|
| **Auth-layer rate limiting** | ✅ Done (Better Auth) | Covers login/signup/2FA. Already wired. |
| **App-layer rate limiting** | ❌ Missing | tRPC middleware on mutations (post.create, reply.create, like.create, flag.create, message.create). PG-backed counter table — keeps infra simple. |
| **Watched words / auto-mod** | ❌ Missing | Regex/string match on post create, queue or auto-reject. Cheap to add. |
| **CSP headers** | ❌ Missing | Config-level, not architectural. |

### Tier 2 — Architectural, decide deliberately

| Item | Status | Notes |
|------|--------|-------|
| **Trust-level-aware permissions** | ❌ Flat role system | Seed via a `trustScore`/`canPostFreely` field in rate-limit middleware. Avoids full TL0–4 rebuild later. |
| **Plugin / theme contract** | ❌ Monolithic | Biggest structural gap vs. Discourse. Decide the shape before code calcifies. |

### Tier 3 — Can wait

i18n, digest emails, backup/restore, sitemap/robots.txt, webhooks, presence indicators, post approval queue, auto badge grants, custom user fields — all additive, low regret to defer.

### Recommended approach for app-layer rate limiting

Given tRPC + Postgres, use a Postgres-backed counter table (same shape as Better Auth's own `rateLimit` schema — `key`, `count`, `lastRequest`). One less piece of infra vs. Redis/Upstash, consistent with how Better Auth already works.

If deploying serverless (Vercel Edge), Upstash is the right call instead.

Middleware pattern:
```ts
const rateLimited = (action: string, limits: (user: User) => { window: number; max: number }) =>
  middleware(async ({ ctx, next }) => {
    const { window, max } = limits(ctx.user);
    const key = `${action}:${ctx.user.id}`;
    // check/increment counter in your store
    if (exceeded) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
    return next();
  });
```
This composes per-action, per-trust-level limits in one place, and seeds the trust-level system — when TL0–4 is built later, you're just expanding the `limits()` function.

## License

Foreum is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support the Project

⭐ Star this repository if you find it helpful!

📣 Share your experience using Foreum

🐛 Report bugs and suggest features

💻 Submit pull requests

Join our community and help make Foreum even better!

## License

This project is open-source and released under the MIT License — free to use, modify and distribute. Contributions are welcomed under the same license.

## Final Notes

Foreum is meant to be a friendly, practical starting point for building a community product. Whether you are product-minded (designers, founders) or developer-minded (engineers, contributors), Foreum tries to make adding value straightforward:

- Clear folders and components make UI changes low-friction.
- Type-safe backend (tRPC + Drizzle) keeps runtime surprises down.
- Auth and user flows are built with common real-world needs in mind (username support, OTP, email verification).

If you like what you see — ⭐ star the repo, open an issue, or submit a PR. Let’s build a vibrant community together!
