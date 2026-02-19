"use client";

import { useState } from "react";
import type { LinkCardData } from "../lib/supabase";

interface LinkCardProps {
  card: LinkCardData;
  onClick?: (url: string) => void;
}

export default function LinkCard({ card, onClick }: LinkCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!card.url) return null;

  const domain = (() => {
    try {
      return new URL(card.url).hostname.replace(/^www\./, "");
    } catch {
      return card.site_name || card.url;
    }
  })();

  const hasTitle = Boolean(card.title?.trim());
  const isTco = domain === "t.co" || card.url.includes("t.co/");
  const headline = hasTitle ? card.title : domain;
  const fallbackText = isTco ? "View article" : "View";

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    if (!onClick) return;
    event.preventDefault();
    onClick(card.url);
  };

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="mt-3 block rounded-2xl border border-[rgb(47,51,54)] overflow-hidden hover:bg-[rgb(30,33,38)] transition-colors"
    >
      {card.image && !imgFailed && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={card.image}
          alt={card.title || "Link preview"}
          className="w-full h-[200px] object-cover"
          onError={() => setImgFailed(true)}
        />
      )}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 text-[rgb(113,118,123)] text-sm truncate">
          <span className="truncate">{domain}</span>
          {hasTitle && (
            <span className="rounded-full border border-[rgb(47,51,54)] px-2 py-0.5 text-[11px] uppercase tracking-wide text-[rgb(113,118,123)]">
              Article
            </span>
          )}
        </div>
        <div className="text-white text-sm mt-0.5 line-clamp-2">
          {headline}
        </div>
        {card.description ? (
          <div className="text-[rgb(113,118,123)] text-sm mt-0.5 line-clamp-2">
            {card.description}
          </div>
        ) : (
          <div className="text-[rgb(113,118,123)] text-sm mt-0.5">
            {fallbackText}
          </div>
        )}
      </div>
    </a>
  );
}
