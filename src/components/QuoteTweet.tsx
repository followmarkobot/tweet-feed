"use client";

import { useEffect, useState } from "react";
import type { Tweet, QuotedTweetData, MediaItem } from "../lib/supabase";
import { fetchTweetById } from "../lib/supabase";
import Avatar from "./Avatar";
import MediaGrid from "./MediaGrid";
import { formatRelativeTime, parseTextWithUrls } from "../lib/utils";

interface QuoteTweetProps {
  quotedTweetId?: string;
  quotedTweet?: QuotedTweetData | null;
}

export default function QuoteTweet({ quotedTweetId, quotedTweet }: QuoteTweetProps) {
  const [fetchedTweet, setFetchedTweet] = useState<Tweet | null>(null);
  const [loading, setLoading] = useState(!quotedTweet && !!quotedTweetId);

  useEffect(() => {
    // If we have inline data, no need to fetch
    if (quotedTweet) return;
    if (!quotedTweetId) return;

    let cancelled = false;
    fetchTweetById(quotedTweetId).then((t) => {
      if (!cancelled) {
        setFetchedTweet(t);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [quotedTweetId, quotedTweet]);

  // Use inline data if available, otherwise use fetched data
  const tweet = quotedTweet || fetchedTweet;

  if (loading) {
    return (
      <div className="mt-3 rounded-2xl border border-[rgb(47,51,54)] p-3 animate-pulse">
        <div className="h-4 bg-[rgb(47,51,54)] rounded w-1/3 mb-2" />
        <div className="h-3 bg-[rgb(47,51,54)] rounded w-2/3" />
      </div>
    );
  }

  if (!tweet) {
    return (
      <div className="mt-3 rounded-2xl border border-[rgb(47,51,54)] p-3 text-[rgb(113,118,123)] text-sm">
        Quoted tweet unavailable
      </div>
    );
  }

  const segments = tweet.tweet_text ? parseTextWithUrls(tweet.tweet_text) : [];
  const media: MediaItem[] = Array.isArray(tweet.media) ? tweet.media : [];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tweet.source_url) {
      window.open(tweet.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="mt-3 rounded-2xl border border-[rgb(47,51,54)] overflow-hidden hover:bg-[rgb(22,24,28)] transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Avatar url={tweet.author_avatar_url || ""} name={tweet.author_display_name || ""} size={20} />
          <span className="font-bold text-white text-sm truncate">
            {tweet.author_display_name || "Unknown"}
          </span>
          <span className="text-[rgb(113,118,123)] text-sm truncate">
            {tweet.author_handle || "@unknown"}
          </span>
          <span className="text-[rgb(113,118,123)] text-sm">·</span>
          <span className="text-[rgb(113,118,123)] text-sm">
            {formatRelativeTime(tweet.timestamp)}
          </span>
        </div>
        <div className="text-white text-[15px] leading-5 whitespace-pre-wrap break-words">
          {segments.map((seg, i) =>
            seg.type === "url" ? (
              <a
                key={i}
                href={seg.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(29,155,240)] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {seg.content}
              </a>
            ) : (
              <span key={i}>{seg.content}</span>
            )
          )}
        </div>
      </div>
      
      {/* Media in quoted tweet */}
      {media.length > 0 && (
        <div className="border-t border-[rgb(47,51,54)]">
          <MediaGrid media={media} />
        </div>
      )}
    </div>
  );
}
