"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Tweet } from "../lib/supabase";
import { fetchTweets, fetchAllTags } from "../lib/supabase";
import TweetCard from "./TweetCard";
import SearchBar from "./SearchBar";
import XConnectBanner from "./XConnectBanner";
import { useXAuth } from "@/contexts/XAuthContext";

interface TweetFeedProps {
  cardComponent?: React.ComponentType<{
    tweet: Tweet;
    onArticleClick?: (url: string, tweet: Tweet) => void;
  }>;
  dataSource?: "stash" | "bookmarks";
  onArticleClick?: (url: string, tweet: Tweet) => void;
}

interface BookmarksPayload {
  tweets: Tweet[];
  next_token: string | null;
}

export default function TweetFeed({
  cardComponent,
  dataSource = "stash",
  onArticleClick,
}: TweetFeedProps) {
  const CardComponent = cardComponent || TweetCard;
  const { isConnected, isChecking, checkStatus } = useXAuth();

  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [page, setPage] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const observerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef(search);
  const tagsRef = useRef(selectedTags);

  searchRef.current = search;
  tagsRef.current = selectedTags;

  useEffect(() => {
    fetchAllTags().then(setAvailableTags);
  }, []);

  const loadStashTweets = useCallback(
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

  const loadBookmarkTweets = useCallback(async (cursorToken: string | null, append: boolean) => {
    setLoading(true);
    try {
      const url = cursorToken
        ? `/api/twitter/bookmarks?cursor=${encodeURIComponent(cursorToken)}`
        : "/api/twitter/bookmarks";

      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 401) {
          setTweets((prev) => (append ? prev : []));
          setHasMore(false);
          await checkStatus();
        }
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      const payload = (await response.json()) as BookmarksPayload;
      setTweets((prev) => (append ? [...prev, ...payload.tweets] : payload.tweets));
      setCursor(payload.next_token || null);
      setHasMore(Boolean(payload.next_token));
    } catch (error) {
      console.error("Failed to load X bookmarks:", error);
      if (!append) setTweets([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [checkStatus]);

  useEffect(() => {
    if (dataSource !== "stash") return;

    setPage(0);
    setCursor(null);
    setTweets([]);
    setHasMore(true);
    setInitialLoading(true);
    loadStashTweets(0, search, selectedTags, false);
  }, [dataSource, search, selectedTags, loadStashTweets]);

  useEffect(() => {
    if (dataSource !== "bookmarks") return;
    checkStatus();
  }, [dataSource, checkStatus]);

  useEffect(() => {
    if (dataSource !== "bookmarks") return;

    setPage(0);
    setCursor(null);
    setTweets([]);

    if (isChecking) {
      setInitialLoading(true);
      return;
    }

    if (!isConnected) {
      setHasMore(false);
      setInitialLoading(false);
      return;
    }

    setHasMore(true);
    setInitialLoading(true);
    loadBookmarkTweets(null, false);
  }, [dataSource, isConnected, isChecking, loadBookmarkTweets]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    if (dataSource === "stash") {
      const nextPage = page + 1;
      setPage(nextPage);
      loadStashTweets(nextPage, searchRef.current, tagsRef.current, true);
      return;
    }

    if (!isConnected || !cursor) return;
    loadBookmarkTweets(cursor, true);
  }, [loading, hasMore, dataSource, page, loadStashTweets, isConnected, cursor, loadBookmarkTweets]);

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

  const showConnectBanner = dataSource === "bookmarks" && !isChecking && !isConnected;

  return (
    <div>
      {dataSource === "stash" && (
        <SearchBar
          onSearch={setSearch}
          onTagFilter={setSelectedTags}
          availableTags={availableTags}
          selectedTags={selectedTags}
        />
      )}

      {showConnectBanner && <XConnectBanner />}

      {initialLoading && (
        <div className="divide-y divide-[rgb(47,51,54)]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse px-4 py-3">
              <div className="flex gap-3">
                <div className="h-12 w-12 shrink-0 rounded-full bg-[rgb(47,51,54)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[rgb(47,51,54)]" />
                  <div className="h-3 w-full rounded bg-[rgb(47,51,54)]" />
                  <div className="h-3 w-2/3 rounded bg-[rgb(47,51,54)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!initialLoading && tweets.length === 0 && !showConnectBanner && (
        <div className="py-16 text-center text-[rgb(113,118,123)]">
          <svg
            className="mx-auto mb-3 h-10 w-10 opacity-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <p className="text-lg font-medium">No tweets found</p>
          <p className="mt-1 text-sm">
            {dataSource === "bookmarks"
              ? "No bookmarks returned from X"
              : search || selectedTags.length > 0
                ? "Try adjusting your search or filters"
                : "Saved tweets will appear here"}
          </p>
        </div>
      )}

      {!initialLoading &&
        tweets.map((tweet) => (
          <CardComponent
            key={tweet.tweet_id || tweet.id}
            tweet={tweet}
            onArticleClick={onArticleClick}
          />
        ))}

      <div ref={observerRef} className="h-1" />

      {loading && !initialLoading && (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[rgb(29,155,240)] border-t-transparent" />
        </div>
      )}

      {!hasMore && tweets.length > 0 && (
        <div className="py-8 text-center text-sm text-[rgb(113,118,123)]">
          You&apos;ve reached the end
        </div>
      )}
    </div>
  );
}
