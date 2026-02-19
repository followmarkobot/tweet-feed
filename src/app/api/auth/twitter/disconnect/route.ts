import { NextRequest, NextResponse } from "next/server";

function clearTwitterCookies(response: NextResponse) {
  const names = [
    "x_access_token",
    "x_refresh_token",
    "x_user_id",
    "x_user_handle",
    "x_expires_at",
    "x_oauth_verifier",
    "x_oauth_state",
  ];

  names.forEach((name) => {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  });
}

function redirectHome(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/", request.url));
  clearTwitterCookies(response);
  return response;
}

export async function POST(request: NextRequest) {
  return redirectHome(request);
}

export async function GET(request: NextRequest) {
  return redirectHome(request);
}
