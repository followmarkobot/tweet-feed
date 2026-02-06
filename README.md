# Stashy 🐿️

Your personal tweet stash. Save tweets from X/Twitter, browse them beautifully.

## Features

- **Save tweets** via Chrome extension
- **Rich previews** — media, quote tweets, link cards
- **Search & filter** by text, author, or tags
- **Multiple views** — Twitter-style, Facebook-style, Substack-style

## Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk (optional)
- **Payments**: Stripe (optional)

## Getting Started

```bash
npm install
npm run dev
```

Set your environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Open [http://localhost:3000](http://localhost:3000) to see your stash.

## Chrome Extension

Companion extension for saving tweets: [clerk-chrome-extension](https://github.com/0xmcc/clerk-chrome-extension) (branch: `feature/tweet-saver`)

---

Built with 🐿️ by the Stashy team
