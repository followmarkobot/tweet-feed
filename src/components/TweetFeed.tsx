"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Tweet } from "../lib/supabase";
import { fetchTweets, fetchAllTags } from "../lib/supabase";
import TweetCard from "./TweetCard";
import SearchBar from "./SearchBar";

interface TweetFeedProps {
  cardComponent?: React.ComponentType<{ tweet: Tweet }>;
}

export default function TweetFeed({ cardComponent }: TweetFeedProps) {
  const CardComponent = cardComponent || TweetCard;
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const observerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef(search);
  const tagsRef = useRef(selectedTags);

  // Keep refs in sync
  searchRef.current = search;
  tagsRef.current = selectedTags;

  // Load available tags once
  useEffect(() => {
    fetchAllTags().then(setAvailableTags);
  }, []);

  const loadTweets = useCallback(
    async (pageNum: number, searchQuery: string, tags: string[], append: boolean) => {
      setLoading(true);
      const result = await fetchTweets(pageNum, searchQuery, tags);
      setTweets((prev) => (append ? [...prev, ...result.tweets] : result.tweets));
      setHasMore(result.hasMore);
      setLoading(false);
      setInitialLoading(false);
    },
    []
  );

  // Initial load and when search/tags change
  useEffect(() => {
    setPage(0);
    setTweets([]);
    setHasMore(true);
    setInitialLoading(true);
    loadTweets(0, search, selectedTags, false);
  }, [search, selectedTags, loadTweets]);

  // Load more
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadTweets(nextPage, searchRef.current, tagsRef.current, true);
  }, [loading, hasMore, page, loadTweets]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <SearchBar
        onSearch={setSearch}
        onTagFilter={setSelectedTags}
        availableTags={availableTags}
        selectedTags={selectedTags}
      />

      {/* Initial loading skeleton */}
      {initialLoading && (
        <div className="divide-y divide-[rgb(47,51,54)]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-[rgb(47,51,54)] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[rgb(47,51,54)] rounded w-1/3" />
                  <div className="h-3 bg-[rgb(47,51,54)] rounded w-full" />
                  <div className="h-3 bg-[rgb(47,51,54)] rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tweet list */}
      {!initialLoading && tweets.length === 0 && (
        <div className="text-center py-16 text-[rgb(113,118,123)]">
          <svg
            className="w-10 h-10 mx-auto mb-3 opacity-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <p className="text-lg font-medium">No tweets found</p>
          <p className="text-sm mt-1">
            {search || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Saved tweets will appear here"}
          </p>
        </div>
      )}

      {!initialLoading &&
        tweets.map((tweet) => (
          <CardComponent key={tweet.id} tweet={tweet} />
        ))}

      {/* Load more trigger for infinite scroll */}
      <div ref={observerRef} className="h-1" />

      {/* Loading indicator */}
      {loading && !initialLoading && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-[rgb(29,155,240)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* End of feed */}
      {!hasMore && tweets.length > 0 && (
        <div className="text-center py-8 text-[rgb(113,118,123)] text-sm">
          You&apos;ve reached the end
        </div>
      )}
    </div>
  );
}
