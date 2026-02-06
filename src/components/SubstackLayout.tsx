"use client";

import { useState } from "react";

/* ─── Mock Data ─── */
const mockIssues = [
  {
    id: 1,
    title: "The Art of Curating Your Timeline",
    date: "Feb 6, 2026",
    snippet:
      "This week: Why the best accounts to follow aren't always the loudest. Plus, three viral threads on productivity, a contrarian take on remote work, and the tweet that broke the internet (again).",
    readTime: "8 min read",
    isLatest: true,
  },
  {
    id: 2,
    title: "Signal vs. Noise: A Curation Manifesto",
    date: "Jan 30, 2026",
    snippet:
      "How to build a Twitter feed that makes you smarter, not angrier. We break down the psychology of the algorithm and share 12 accounts that consistently deliver value.",
    readTime: "6 min read",
    isLatest: false,
  },
  {
    id: 3,
    title: "The Best Threads of January",
    date: "Jan 23, 2026",
    snippet:
      "A monster thread on AI from @sama, Naval's updated life advice, and a surprisingly deep analysis of why we can't stop doomscrolling. All the good stuff, none of the noise.",
    readTime: "5 min read",
    isLatest: false,
  },
  {
    id: 4,
    title: "Welcome to The Weekly Stash 🐿️",
    date: "Jan 16, 2026",
    snippet:
      "The internet is overwhelming. We're here to help. Every week, we'll send you the best tweets we've saved—curated threads, hot takes, and hidden gems you might have missed.",
    readTime: "3 min read",
    isLatest: false,
  },
];

/* ─── Issue Card Component ─── */
function IssueCard({
  title,
  date,
  snippet,
  readTime,
  isLatest,
}: {
  title: string;
  date: string;
  snippet: string;
  readTime: string;
  isLatest?: boolean;
}) {
  return (
    <article
      className={`group cursor-pointer transition-colors ${
        isLatest
          ? "bg-[rgb(22,24,28)] border border-[rgb(47,51,54)] rounded-xl p-6 hover:border-[rgb(29,155,240)]/50"
          : "border-b border-[rgb(47,51,54)] py-6 hover:bg-[rgb(22,24,28)]/50 px-2 -mx-2 rounded-lg"
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-[rgb(113,118,123)] mb-2">
        <time>{date}</time>
        <span>·</span>
        <span>{readTime}</span>
      </div>
      <h3
        className={`font-bold text-[rgb(231,233,234)] group-hover:text-[rgb(29,155,240)] transition-colors ${
          isLatest ? "text-2xl mb-3" : "text-lg mb-2"
        }`}
      >
        {title}
      </h3>
      <p className="text-[rgb(139,144,150)] leading-relaxed">{snippet}</p>
      <div className="mt-4">
        <span className="text-[rgb(29,155,240)] text-sm font-medium group-hover:underline">
          Read →
        </span>
      </div>
    </article>
  );
}

/* ─── Main Component ─── */
export default function SubstackLayout() {
  const [email, setEmail] = useState("");

  const latestIssue = mockIssues.find((issue) => issue.isLatest);
  const pastIssues = mockIssues.filter((issue) => !issue.isLatest);

  return (
    <div className="min-h-screen bg-black">
      {/* ══════════ HERO SECTION ══════════ */}
      <header className="border-b border-[rgb(47,51,54)]">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          {/* Newsletter Name */}
          <h1 className="text-4xl md:text-5xl font-bold text-[rgb(231,233,234)] mb-4">
            The Weekly Stash 🐿️
          </h1>

          {/* Tagline */}
          <p className="text-xl text-[rgb(139,144,150)] mb-8">
            The best tweets, curated weekly
          </p>

          {/* Subscribe CTA */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-[rgb(22,24,28)] border border-[rgb(47,51,54)] rounded-lg px-4 py-3 text-[rgb(231,233,234)] placeholder-[rgb(113,118,123)] focus:outline-none focus:border-[rgb(29,155,240)] transition-colors"
              />
              <button className="bg-[rgb(29,155,240)] hover:bg-[rgb(26,140,216)] text-white font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-[rgb(113,118,123)] mt-3">
              Free. Delivered every Thursday. No spam, ever.
            </p>
          </div>
        </div>
      </header>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Latest Issue Section */}
        {latestIssue && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-[rgb(47,51,54)]" />
              <h2 className="text-sm font-semibold text-[rgb(113,118,123)] uppercase tracking-wider">
                Latest Issue
              </h2>
              <div className="h-px flex-1 bg-[rgb(47,51,54)]" />
            </div>
            <IssueCard {...latestIssue} />
          </section>
        )}

        {/* Past Issues Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[rgb(47,51,54)]" />
            <h2 className="text-sm font-semibold text-[rgb(113,118,123)] uppercase tracking-wider">
              Past Issues
            </h2>
            <div className="h-px flex-1 bg-[rgb(47,51,54)]" />
          </div>
          <div className="space-y-2">
            {pastIssues.map((issue) => (
              <IssueCard key={issue.id} {...issue} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 text-center py-12 border-t border-[rgb(47,51,54)]">
          <h3 className="text-2xl font-bold text-[rgb(231,233,234)] mb-3">
            Never miss an issue
          </h3>
          <p className="text-[rgb(139,144,150)] mb-6">
            Join readers who get the best of Twitter, curated and delivered.
          </p>
          <button className="bg-[rgb(29,155,240)] hover:bg-[rgb(26,140,216)] text-white font-bold px-8 py-3 rounded-full transition-colors">
            Subscribe for free
          </button>
        </section>
      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-[rgb(47,51,54)] py-8">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm text-[rgb(113,118,123)]">
            © 2026 The Weekly Stash · Powered by Tweet Saver
          </p>
        </div>
      </footer>
    </div>
  );
}
