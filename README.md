# SketchToCode - Wireframe to Code Converter

Transform hand-drawn wireframes into production-ready code using AI vision technology.

![SketchToCode](https://via.placeholder.com/800x400/6366f1/ffffff?text=SketchToCode)

## Features

- **AI-Powered Analysis** - Advanced AI interprets hand-drawn wireframes with high accuracy
- **Multiple Export Formats** - HTML/CSS, React JSX, JSON structure
- **Live Preview** - See your generated website instantly
- **Responsive Output** - All generated code is mobile-first
- **Credit System** - Pay only for what you use
- **Conversion History** - Access all your past conversions

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI Components | Radix UI + shadcn/ui |
| Authentication | Clerk |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe |
| AI | Anthropic API |
| Hosting | Vercel |

## Quick Start

### 1. Clone and Install

```bash
cd sketch-to-code
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the schema from `supabase/schema.sql`

### 4. Set Up Clerk

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Copy the API keys to your `.env.local`
3. Configure OAuth providers if desired (Google, GitHub)

### 5. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Copy API keys to `.env.local`
3. Set up webhook endpoint:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/sketch-to-code)

### Manual Deploy

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production URL
2. Update Stripe webhook URL to production endpoint
3. Update Clerk allowed origins

## Cost Analysis

### AI Cost Per Conversion

| Component | Cost |
|-----------|------|
| AI API (image + response) | ~$0.15-0.25 |
| **Total per conversion** | **~$0.25** |

### Pricing Strategy

| Plan | Price | Cost | Profit |
|------|-------|------|--------|
| Per conversion | $3.99 | $0.25 | $3.44 (86%) |
| 10-pack | $25 ($2.50/ea) | $2.50 | $22.50 (90%) |
| 50-pack | $100 ($2.00/ea) | $12.50 | $87.50 (88%) |
| 100-pack | $180 ($1.80/ea) | $25.00 | $155 (86%) |

### Break-Even Analysis

| Monthly Revenue Goal | Conversions Needed | Users (at 5 conv/user) |
|---------------------|-------------------|----------------------|
| $1,000 | ~290 conversions | ~58 users |
| $5,000 | ~1,450 conversions | ~290 users |
| $10,000 | ~2,900 conversions | ~580 users |

### Hosting Costs

- **Vercel**: Free tier (hobby) or $20/month (pro)
- **Supabase**: Free tier up to 500MB, then $25/month
- **Clerk**: Free up to 10,000 MAU, then $0.02/MAU

## Project Structure

```
sketch-to-code/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts      # Stripe checkout
│   │   ├── convert/route.ts       # AI conversion
│   │   ├── credits/route.ts       # Credit balance
│   │   ├── history/route.ts       # Conversion history
│   │   └── webhooks/stripe/route.ts
│   ├── app/
│   │   ├── page.tsx               # Converter interface
│   │   ├── layout.tsx             # Protected layout
│   │   └── history/page.tsx       # History page
│   ├── pricing/page.tsx           # Pricing page
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   └── globals.css
├── components/
│   └── ui/                        # Reusable UI components
├── lib/
│   ├── stripe.ts                  # Stripe client
│   ├── supabase.ts                # Supabase client
│   └── utils.ts                   # Utility functions
├── types/
│   └── database.ts                # TypeScript types
├── supabase/
│   └── schema.sql                 # Database schema
├── middleware.ts                  # Auth middleware
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/convert` | POST | Convert wireframe to code |
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/credits` | GET | Get user credit balance |
| `/api/history` | GET | Get conversion history |
| `/api/webhooks/stripe` | POST | Handle Stripe webhooks |

## Testing Payments

Use Stripe test cards:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Declined payment |

## Security Considerations

- All API keys stored in environment variables
- Clerk handles authentication securely
- Stripe webhooks verified with signature
- Database access via service role key (server-side only)
- CORS and rate limiting via Vercel

## Future Improvements (v2)

- [ ] Multi-page wireframe support
- [ ] Style customization (colors, fonts)
- [ ] Team workspaces
- [ ] API access for developers
- [ ] Vue/Svelte/Angular export
- [ ] Figma plugin integration
- [ ] Sketch annotations
- [ ] White-label option

## Troubleshooting

### Common Issues

**Clerk authentication not working**
- Ensure all Clerk env vars are set
- Check allowed origins in Clerk dashboard

**Stripe webhooks failing**
- Verify webhook secret is correct
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**Supabase connection errors**
- Verify URL and keys are correct
- Check if RLS policies allow access

**AI API errors**
- Verify API key is valid
- Check rate limits

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, open a GitHub issue or contact support@sketchtocode.app
