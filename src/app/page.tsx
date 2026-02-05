"use client";

import TweetFeed from "../components/TweetFeed";
import LeftSidebar from "../components/LeftSidebar";
import TweetCard from "../components/TweetCard";
import FacebookCard from "../components/FacebookCard";
import { useView } from "../contexts/ViewContext";

export const dynamic = "force-dynamic";

export default function Home() {
  const { view } = useView();
  const isFacebook = view === "facebook";
  const CardComponent = isFacebook ? FacebookCard : TweetCard;

  return (
    <main className="min-h-screen">
      <LeftSidebar />

      {/* Main content area — offset for sidebar on md+ */}
      <div className="md:ml-[68px] lg:ml-[240px] transition-all duration-200 pb-16 md:pb-0">
        <div
          className={`mx-auto min-h-screen ${
            isFacebook
              ? "max-w-[680px] px-4 py-4"
              : "max-w-[600px] border-x border-[rgb(47,51,54)]"
          }`}
        >
          {/* Header */}
          <header
            className={`sticky top-0 z-10 backdrop-blur-md border-b border-[rgb(47,51,54)] px-4 py-3 ${
              isFacebook
                ? "bg-[rgb(36,37,38)]/80 rounded-t-lg"
                : "bg-black/80"
            }`}
          >
            <div className="flex items-center gap-3">
              {isFacebook ? (
                <svg
                  className="w-7 h-7 text-[rgb(66,133,244)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              )}
              <h1 className="text-xl font-bold text-white">Saved Tweets</h1>
            </div>
          </header>

          {/* Feed */}
          <TweetFeed cardComponent={CardComponent} />
        </div>
      </div>
    </main>
  );
}
