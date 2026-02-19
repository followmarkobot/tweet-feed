import { NextRequest, NextResponse } from "next/server";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export const runtime = "nodejs";

function parseTargetUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const targetUrl = parseTargetUrl(request.nextUrl.searchParams.get("url"));

  if (!targetUrl) {
    return NextResponse.json({ error: "Invalid or missing url parameter." }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; StashyBot/1.0; +https://stashy.local)",
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Could not fetch article (${response.status}).` },
        { status: 422 }
      );
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url: targetUrl });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json(
        { error: "Could not extract readable article content." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      title: article.title,
      byline: article.byline,
      content: article.content,
      excerpt: article.excerpt,
      siteName: article.siteName,
    });
  } catch (error) {
    console.error("Article extraction failed:", error);
    return NextResponse.json(
      { error: "Failed to extract article content." },
      { status: 500 }
    );
  }
}
