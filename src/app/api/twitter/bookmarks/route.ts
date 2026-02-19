import { NextRequest, NextResponse } from "next/server";
import { mapXBookmarksToTweets } from "@/lib/twitter";

export const runtime = "nodejs";

interface BookmarkResponse {
  data?: unknown[];
  includes?: {
    users?: unknown[];
    media?: unknown[];
    tweets?: unknown[];
  };
  meta?: {
    next_token?: string;
  };
}

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

function getTokenRequestHeaders(clientId: string, clientSecret?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (clientSecret) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  return headers;
}

async function fetchBookmarks(accessToken: string, userId: string, cursor?: string | null) {
  const url = new URL(`https://api.x.com/2/users/${userId}/bookmarks`);
  url.searchParams.set(
    "tweet.fields",
    "created_at,public_metrics,entities,in_reply_to_user_id,conversation_id,referenced_tweets,attachments"
  );
  url.searchParams.set(
    "expansions",
    "author_id,attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id"
  );
  url.searchParams.set("user.fields", "name,username,profile_image_url");
  url.searchParams.set("media.fields", "url,preview_image_url,type,width,height");
  url.searchParams.set("max_results", "20");

  if (cursor) {
    url.searchParams.set("pagination_token", cursor);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return { unauthorized: true as const, payload: null };
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Bookmarks fetch failed: ${details}`);
  }

  return {
    unauthorized: false as const,
    payload: (await response.json()) as BookmarkResponse,
  };
}

async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse | null> {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;

  if (!clientId) return null;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: getTokenRequestHeaders(clientId, clientSecret),
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as RefreshResponse;
}

function setRefreshedCookies(
  response: NextResponse,
  refreshed: RefreshResponse,
  refreshTokenFallback: string
) {
  const secure = process.env.NODE_ENV === "production";
  const expiresIn = refreshed.expires_in ?? 7200;

  response.cookies.set("x_access_token", refreshed.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: expiresIn,
    path: "/",
  });

  response.cookies.set("x_refresh_token", refreshed.refresh_token || refreshTokenFallback, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });

  response.cookies.set("x_expires_at", String(Date.now() + expiresIn * 1000), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });
}

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor");
  const accessTokenCookie = request.cookies.get("x_access_token")?.value;
  const refreshTokenCookie = request.cookies.get("x_refresh_token")?.value;
  const userId = request.cookies.get("x_user_id")?.value;

  if (!accessTokenCookie || !userId) {
    return NextResponse.json({ error: "Not connected to X." }, { status: 401 });
  }

  try {
    let accessToken = accessTokenCookie;
    let responsePayload = await fetchBookmarks(accessToken, userId, cursor);
    let refreshedToken: RefreshResponse | null = null;

    if (responsePayload.unauthorized) {
      if (!refreshTokenCookie) {
        return NextResponse.json({ error: "X token expired." }, { status: 401 });
      }

      refreshedToken = await refreshAccessToken(refreshTokenCookie);
      if (!refreshedToken?.access_token) {
        return NextResponse.json({ error: "Unable to refresh X token." }, { status: 401 });
      }

      accessToken = refreshedToken.access_token;
      responsePayload = await fetchBookmarks(accessToken, userId, cursor);

      if (responsePayload.unauthorized) {
        return NextResponse.json({ error: "X token is unauthorized." }, { status: 401 });
      }
    }

    if (!responsePayload.payload) {
      return NextResponse.json({ tweets: [], next_token: null });
    }

    const tweets = mapXBookmarksToTweets(
      responsePayload.payload.data as Parameters<typeof mapXBookmarksToTweets>[0],
      responsePayload.payload.includes as Parameters<typeof mapXBookmarksToTweets>[1]
    );

    const result = NextResponse.json({
      tweets,
      next_token: responsePayload.payload.meta?.next_token ?? null,
    });

    if (refreshedToken && refreshTokenCookie) {
      setRefreshedCookies(result, refreshedToken, refreshTokenCookie);
    }

    return result;
  } catch (error) {
    console.error("Bookmarks route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks from X." },
      { status: 500 }
    );
  }
}
