import { NextRequest, NextResponse } from "next/server";

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

interface MeResponse {
  data?: {
    id: string;
    username?: string;
  };
}

async function exchangeCodeForToken(code: string, verifier: string): Promise<TokenResponse> {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const callbackUrl = process.env.TWITTER_CALLBACK_URL;

  if (!clientId || !callbackUrl) {
    throw new Error("Missing Twitter OAuth environment variables.");
  }

  const body = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    redirect_uri: callbackUrl,
    code_verifier: verifier,
    client_id: clientId,
  });

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (clientSecret) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Token exchange failed: ${details}`);
  }

  return (await response.json()) as TokenResponse;
}

async function fetchCurrentUser(accessToken: string): Promise<MeResponse["data"]> {
  const response = await fetch("https://api.x.com/2/users/me?user.fields=username", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to fetch current user: ${details}`);
  }

  const payload = (await response.json()) as MeResponse;
  return payload.data;
}

function clearPkceCookies(response: NextResponse) {
  response.cookies.set("x_oauth_verifier", "", { maxAge: 0, path: "/" });
  response.cookies.set("x_oauth_state", "", { maxAge: 0, path: "/" });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedVerifier = request.cookies.get("x_oauth_verifier")?.value;
  const storedState = request.cookies.get("x_oauth_state")?.value;

  const redirectErrorUrl = new URL("/?xConnected=0", request.url);

  if (!code || !state || !storedVerifier || !storedState || state !== storedState) {
    const response = NextResponse.redirect(redirectErrorUrl);
    clearPkceCookies(response);
    return response;
  }

  try {
    const token = await exchangeCodeForToken(code, storedVerifier);
    const user = await fetchCurrentUser(token.access_token);

    if (!user?.id) {
      throw new Error("Twitter user id missing in /users/me response");
    }

    const secure = process.env.NODE_ENV === "production";
    const expiresAt = Date.now() + (token.expires_in ?? 7200) * 1000;

    const response = NextResponse.redirect(new URL("/?xConnected=1", request.url));
    clearPkceCookies(response);

    response.cookies.set("x_access_token", token.access_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: token.expires_in ?? 7200,
      path: "/",
    });

    if (token.refresh_token) {
      response.cookies.set("x_refresh_token", token.refresh_token, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 90,
        path: "/",
      });
    }

    response.cookies.set("x_user_id", user.id, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });

    response.cookies.set("x_user_handle", user.username ?? "", {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });

    response.cookies.set("x_expires_at", String(expiresAt), {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Twitter callback error:", error);
    const response = NextResponse.redirect(redirectErrorUrl);
    clearPkceCookies(response);
    return response;
  }
}
