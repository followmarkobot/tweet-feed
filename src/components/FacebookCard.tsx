"use client";

import type { Tweet } from "../lib/supabase";
import Avatar from "./Avatar";
import MediaGrid from "./MediaGrid";
import QuoteTweet from "./QuoteTweet";
import { formatRelativeTime, parseTextWithUrls } from "../lib/utils";

interface FacebookCardProps {
  tweet: Tweet;
}

function FacebookLinkCard({ card }: { card: Tweet["link_cards"][number] }) {
  if (!card.url) return null;

  const domain = (() => {
    try {
      return new URL(card.url).hostname.replace(/^www\./, "").toUpperCase();
    } catch {
      return card.site_name || card.url;
    }
  })();

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block overflow-hidden border border-[rgb(58,59,60)] hover:opacity-90 transition-opacity"
    >
      {card.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={card.image}
          alt={card.title || "Link preview"}
          className="w-full h-[260px] object-cover"
        />
      )}
      <div className="bg-[rgb(44,46,48)] px-4 py-3">
        <div className="text-[rgb(176,179,184)] text-xs uppercase tracking-wide">
          {domain}
        </div>
        {card.title && (
          <div className="text-white text-[15px] font-semibold mt-1 line-clamp-2">
            {card.title}
          </div>
        )}
        {card.description && (
          <div className="text-[rgb(176,179,184)] text-sm mt-1 line-clamp-2">
            {card.description}
          </div>
        )}
      </div>
    </a>
  );
}

export default function FacebookCard({ tweet }: FacebookCardProps) {
  const segments = tweet.tweet_text ? parseTextWithUrls(tweet.tweet_text) : [];

  return (
    <article className="bg-[rgb(36,37,38)] rounded-lg shadow-md mb-4 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start gap-3">
        <Avatar url={tweet.author_avatar_url} name={tweet.author_display_name} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-[15px] truncate">
              {tweet.author_display_name || "Unknown"}
            </span>
            <span className="text-[rgb(176,179,184)] text-sm truncate">
              @{tweet.author_handle || "unknown"}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {tweet.source_url ? (
              <a
                href={tweet.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(176,179,184)] text-xs hover:underline"
              >
                {formatRelativeTime(tweet.timestamp)}
              </a>
            ) : (
              <span className="text-[rgb(176,179,184)] text-xs">
                {formatRelativeTime(tweet.timestamp)}
              </span>
            )}
            <span className="text-[rgb(176,179,184)] text-xs">·</span>
            <svg className="w-3 h-3 text-[rgb(176,179,184)]" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Reply indicator */}
      {tweet.in_reply_to_tweet_id && (
        <div className="px-4 pb-1">
          <span className="text-[rgb(176,179,184)] text-xs">↩ Replying to a tweet</span>
        </div>
      )}

      {/* Post text */}
      {tweet.tweet_text && (
        <div className="px-4 pb-3 text-white text-[15px] leading-6 whitespace-pre-wrap break-words">
          {segments.map((seg, i) =>
            seg.type === "url" ? (
              <a
                key={i}
                href={seg.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(66,133,244)] hover:underline"
              >
                {seg.content}
              </a>
            ) : (
              <span key={i}>{seg.content}</span>
            )
          )}
        </div>
      )}

      {/* Tags */}
      {tweet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {tweet.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block text-xs px-2 py-0.5 rounded-full bg-[rgb(66,133,244)] bg-opacity-15 text-[rgb(66,133,244)] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {tweet.notes && (
        <div className="px-4 pb-3 text-sm text-[rgb(176,179,184)] italic border-l-2 border-[rgb(58,59,60)] ml-4">
          📝 {tweet.notes}
        </div>
      )}

      {/* Media — full width, no side padding */}
      {tweet.media.length > 0 && (
        <div className="fb-media">
          <MediaGrid media={tweet.media} />
        </div>
      )}

      {/* Link cards */}
      {tweet.link_cards.length > 0 && (
        <div className="px-4">
          {tweet.link_cards.map((card, i) => (
            <FacebookLinkCard key={i} card={card} />
          ))}
        </div>
      )}

      {/* Quote tweet */}
      {tweet.quoted_tweet_id && (
        <div className="px-4">
          <QuoteTweet quotedTweetId={tweet.quoted_tweet_id} />
        </div>
      )}

      {/* Engagement counts (fake) */}
      <div className="px-4 py-2 flex items-center justify-between text-[rgb(176,179,184)] text-sm">
        <div className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-[rgb(66,133,244)] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 8.864.046z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[rgb(58,59,60)]" />

      {/* Action bar */}
      <div className="px-2 py-1 flex">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-[rgb(44,46,48)] transition-colors text-[rgb(176,179,184)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
          </svg>
          <span className="text-sm font-medium">Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-[rgb(44,46,48)] transition-colors text-[rgb(176,179,184)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <span className="text-sm font-medium">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-[rgb(44,46,48)] transition-colors text-[rgb(176,179,184)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>
    </article>
  );
}
