"use client";

import { useEffect, useMemo, useState } from "react";
import type { Tweet } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/utils";

interface ReaderPayload {
  title?: string;
  byline?: string;
  content?: string;
  excerpt?: string;
  siteName?: string;
  error?: string;
}

interface ArticleReaderViewProps {
  articleUrl: string;
  tweet: Tweet | null;
  onClose: () => void;
}

function urlDomain(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

export default function ArticleReaderView({ articleUrl, tweet, onClose }: ArticleReaderViewProps) {
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ReaderPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticle() {
      setLoading(true);
      setError(null);
      setArticle(null);

      try {
        const response = await fetch(`/api/read-article?url=${encodeURIComponent(articleUrl)}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        const payload = (await response.json()) as ReaderPayload;

        if (!response.ok || payload.error) {
          throw new Error(payload.error || "Could not extract article content.");
        }

        setArticle(payload);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Could not extract article content.");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();

    return () => {
      controller.abort();
    };
  }, [articleUrl]);

  const domain = useMemo(() => urlDomain(articleUrl), [articleUrl]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="h-full overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-[rgb(47,51,54)] bg-black/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 w-full max-w-[980px] items-center justify-between px-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(231,233,234)] hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Back to feed
            </button>

            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(29,155,240)] hover:underline"
            >
              Open in browser
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5A1.5 1.5 0 0 1 7.5 6H12m-6 3v7.5A1.5 1.5 0 0 0 7.5 18H15a1.5 1.5 0 0 0 1.5-1.5V12" />
              </svg>
            </a>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6">
          {loading && (
            <div className="mx-auto max-w-[680px] animate-pulse space-y-4">
              <div className="h-8 w-3/4 rounded bg-[rgb(47,51,54)]" />
              <div className="h-4 w-1/2 rounded bg-[rgb(47,51,54)]" />
              <div className="h-28 rounded-2xl bg-[rgb(22,24,28)]" />
              <div className="h-4 w-full rounded bg-[rgb(47,51,54)]" />
              <div className="h-4 w-full rounded bg-[rgb(47,51,54)]" />
              <div className="h-4 w-5/6 rounded bg-[rgb(47,51,54)]" />
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-[680px] rounded-2xl border border-[rgb(47,51,54)] bg-[rgb(10,12,15)] p-6">
              <h2 className="text-lg font-semibold text-white">Couldn&apos;t extract article</h2>
              <p className="mt-2 text-sm text-[rgb(113,118,123)]">{error}</p>
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[rgb(29,155,240)] hover:underline"
              >
                Open in browser
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5A1.5 1.5 0 0 1 7.5 6H12m-6 3v7.5A1.5 1.5 0 0 0 7.5 18H15a1.5 1.5 0 0 0 1.5-1.5V12" />
                </svg>
              </a>
            </div>
          )}

          {!loading && !error && (
            <article className="mx-auto max-w-[680px]">
              <h1 className="text-3xl font-bold leading-tight text-white">
                {article?.title || domain}
              </h1>
              <p className="mt-2 text-sm text-[rgb(113,118,123)]">
                {[article?.byline, article?.siteName || domain].filter(Boolean).join(" · ")}
              </p>

              {tweet && (
                <div className="mt-5 rounded-2xl border border-[rgb(47,51,54)] bg-[rgb(10,12,15)] p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-white">{tweet.author_display_name || "Unknown"}</span>
                    <span className="text-[rgb(113,118,123)]">@{tweet.author_handle || "unknown"}</span>
                    {tweet.timestamp && (
                      <>
                        <span className="text-[rgb(113,118,123)]">·</span>
                        <span className="text-[rgb(113,118,123)]">{formatRelativeTime(tweet.timestamp)}</span>
                      </>
                    )}
                  </div>
                  {tweet.tweet_text && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[rgb(231,233,234)]">{tweet.tweet_text}</p>
                  )}
                </div>
              )}

              {article?.excerpt && (
                <p className="mt-6 border-l-2 border-[rgb(47,51,54)] pl-4 text-base italic text-[rgb(170,174,178)]">
                  {article.excerpt}
                </p>
              )}

              {article?.content && (
                <div
                  className="article-reader-content mt-8 text-[17px] leading-8 text-[rgb(231,233,234)] [&_a]:text-[rgb(29,155,240)] [&_a]:underline-offset-2 [&_a:hover]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[rgb(47,51,54)] [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-2xl [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_li]:mb-2 [&_ol]:my-4 [&_ol]:pl-5 [&_p]:mb-5 [&_strong]:text-white [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
