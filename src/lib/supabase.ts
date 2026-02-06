import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
    );
  }
  _supabase = createClient(url, key);
  return _supabase;
}

export interface QuotedTweetData {
  tweet_id: string;
  tweet_text: string;
  author_handle: string;
  author_display_name: string;
  author_avatar_url: string;
  timestamp: string | null;
  source_url: string;
  media: MediaItem[];
}

export interface Tweet {
  id: number;
  tweet_id: string;
  tweet_text: string | null;
  author_handle: string | null;
  author_display_name: string | null;
  author_avatar_url: string | null;
  timestamp: string | null;
  source_url: string | null;
  media: MediaItem[];
  link_cards: LinkCardData[];
  quoted_tweet_id: string | null;
  quoted_tweet: QuotedTweetData | null;
  in_reply_to_tweet_id: string | null;
  conversation_id: string | null;
  raw_json: Record<string, unknown> | null;
  tags: string[];
  notes: string | null;
  saved_at: string | null;
  created_at: string | null;
}

export interface MediaItem {
  type: "image" | "video" | "gif";
  url: string;
}

export interface LinkCardData {
  url: string;
  title: string;
  description: string;
  image: string;
  site_name: string;
}

const PAGE_SIZE = 20;

export async function fetchTweets(
  page: number,
  search?: string,
  tags?: string[]
): Promise<{ tweets: Tweet[]; hasMore: boolean }> {
  let query = getSupabase()
    .from("tweets")
    .select("*")
    .order("saved_at", { ascending: false, nullsFirst: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`tweet_text.ilike.${term},author_handle.ilike.${term}`);
  }

  if (tags && tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tweets:", error);
    return { tweets: [], hasMore: false };
  }

  const tweets = (data ?? []).map((row) => ({
    ...row,
    media: Array.isArray(row.media) ? row.media : [],
    link_cards: Array.isArray(row.link_cards) ? row.link_cards : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
  })) as Tweet[];

  return { tweets, hasMore: tweets.length === PAGE_SIZE };
}

export async function fetchTweetById(
  tweetId: string
): Promise<Tweet | null> {
  const { data, error } = await getSupabase()
    .from("tweets")
    .select("*")
    .eq("tweet_id", tweetId)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    media: Array.isArray(data.media) ? data.media : [],
    link_cards: Array.isArray(data.link_cards) ? data.link_cards : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
  } as Tweet;
}

export async function fetchAllTags(): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("tweets")
    .select("tags");

  if (error || !data) return [];

  const tagSet = new Set<string>();
  data.forEach((row) => {
    const tags = Array.isArray(row.tags) ? row.tags : [];
    tags.forEach((tag: string) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
