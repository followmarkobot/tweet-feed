"use client";

import type { Tweet } from "../lib/supabase";
import Avatar from "./Avatar";
import MediaGrid from "./MediaGrid";
import LinkCard from "./LinkCard";
import QuoteTweet from "./QuoteTweet";
import { formatRelativeTime, parseTextWithUrls } from "../lib/utils";

interface TweetCardProps {
  tweet: Tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  const segments = tweet.tweet_text ? parseTextWithUrls(tweet.tweet_text) : [];

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a link, button, or interactive element
    const target = e.target as HTMLElement;
    if (target.closest('a, button, [role="button"]')) return;
    
    if (tweet.source_url) {
      window.open(tweet.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article 
      className="border-b border-[rgb(47,51,54)] px-4 py-3 hover:bg-[rgb(8,10,13)] transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Reply indicator */}
      {tweet.in_reply_to_tweet_id && (
        <div className="flex items-center gap-2 mb-1 ml-[56px]">
          <svg
            className="w-4 h-4 text-[rgb(113,118,123)]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.25-.893 4.306-2.394 5.786l-3.525 3.55c-.19.19-.44.29-.69.29-.25 0-.5-.1-.69-.29-.38-.39-.38-1.01 0-1.39l3.525-3.55c1.12-1.11 1.775-2.65 1.775-4.4 0-3.38-2.735-6.13-6.13-6.13H9.756c-3.317 0-6.005 2.69-6.005 6v.58c0 .55-.45 1-1 1s-1-.45-1-1V10z" />
          </svg>
          <span className="text-[rgb(113,118,123)] text-sm">
            Replying to a tweet
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          <Avatar
            url={tweet.author_avatar_url}
            name={tweet.author_display_name}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-bold text-white truncate max-w-[200px]">
              {tweet.author_display_name || "Unknown"}
            </span>
            <span className="text-[rgb(113,118,123)] truncate max-w-[180px]">
              @{tweet.author_handle || "unknown"}
            </span>
            <span className="text-[rgb(113,118,123)]">·</span>
            {tweet.source_url ? (
              <a
                href={tweet.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(113,118,123)] hover:underline"
              >
                {formatRelativeTime(tweet.timestamp)}
              </a>
            ) : (
              <span className="text-[rgb(113,118,123)]">
                {formatRelativeTime(tweet.timestamp)}
              </span>
            )}
          </div>

          {/* Tweet text */}
          {tweet.tweet_text && (
            <div className="mt-1 text-white text-[15px] leading-5 whitespace-pre-wrap break-words">
              {segments.map((seg, i) =>
                seg.type === "url" ? (
                  <a
                    key={i}
                    href={seg.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[rgb(29,155,240)] hover:underline"
                  >
                    {seg.content}
                  </a>
                ) : (
                  <span key={i}>{seg.content}</span>
                )
              )}
            </div>
          )}

          {/* Media */}
          <MediaGrid media={tweet.media} />

          {/* Link cards */}
          {tweet.link_cards.length > 0 && (
            <div>
              {tweet.link_cards.map((card, i) => (
                <LinkCard key={i} card={card} />
              ))}
            </div>
          )}

          {/* Quote tweet */}
          {(tweet.quoted_tweet || tweet.quoted_tweet_id) && (
            <QuoteTweet 
              quotedTweet={tweet.quoted_tweet} 
              quotedTweetId={tweet.quoted_tweet_id || undefined} 
            />
          )}

          {/* Tags */}
          {tweet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tweet.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-xs px-2 py-0.5 rounded-full bg-[rgb(29,155,240)] bg-opacity-15 text-[rgb(29,155,240)] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {tweet.notes && (
            <div className="mt-2 text-sm text-[rgb(113,118,123)] italic border-l-2 border-[rgb(47,51,54)] pl-3">
              📝 {tweet.notes}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
