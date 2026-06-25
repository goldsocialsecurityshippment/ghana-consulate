# Ace Mobile Hub — Official Website

**Ghana's trusted iPhone specialist** | Accra Circle Mall

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Project Structure
```
ace-mobile-hub/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── collection/         # Full iPhone collection
│   ├── iphone/[slug]/      # Dynamic iPhone detail pages (27 models)
│   ├── about/              # About page
│   ├── sell/               # Sell Your iPhone
│   ├── swap/               # Swap Your iPhone
│   ├── installment/        # Installment Plans
│   ├── comparison/         # iPhone comparison tool
│   ├── how-it-works/       # Process guide
│   ├── contact/            # Contact page
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # robots.txt
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Reusable page sections
│   └── ui/                 # UI primitives
├── data/
│   └── iphones.ts          # Complete iPhone data (27 models)
├── lib/
│   └── utils.ts            # Utilities, constants, WhatsApp links
├── public/
│   └── images/             # Hero, iPhones, testimonials, delivery, gallery
└── render.yaml             # Render deployment config
```

## Local Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deployment (Render)
1. Push to GitHub
2. Connect repository in Render dashboard
3. Use `render.yaml` for automatic configuration
4. Set environment: `NODE_ENV=production`

## Key Pages
| Page | Route |
|------|-------|
| Homepage | `/` |
| Collection | `/collection` |
| iPhone Detail | `/iphone/[slug]` |
| Sell | `/sell` |
| Swap | `/swap` |
| Installment | `/installment` |
| Compare | `/comparison` |
| How It Works | `/how-it-works` |
| About | `/about` |
| Contact | `/contact` |

## WhatsApp Integration
All CTAs route via WhatsApp to: **+233545420719**
Pre-filled message context is passed for each action (buy, sell, swap, installment).

## SEO
- Metadata, Open Graph, Twitter Cards on all pages
- Schema.org LocalBusiness structured data
- Auto-generated sitemap.xml and robots.txt
- Canonical URLs configured

## Business Info
- **Phone:** 0545420719
- **Location:** Accra Circle Mall, Ghana
- **Hours:** Mon–Sat 9am–7pm | Sun 11am–5pm
