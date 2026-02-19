"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import TweetFeed from "../components/TweetFeed";
import LeftSidebar from "../components/LeftSidebar";
import TweetCard from "../components/TweetCard";
import FacebookCard from "../components/FacebookCard";
import FacebookLayout from "../components/FacebookLayout";
import SubstackLayout from "../components/SubstackLayout";
import UpgradeBanner from "../components/UpgradeBanner";
import PricingModal from "../components/PricingModal";
import OnboardingModal from "../components/OnboardingModal";
import ArticleReaderView from "../components/ArticleReaderView";
import type { Tweet } from "../lib/supabase";
import { useView } from "../contexts/ViewContext";
import { XAuthProvider, useXAuth } from "../contexts/XAuthContext";

export const dynamic = "force-dynamic";

type DataSource = "stash" | "bookmarks";

function SuccessToast({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="animate-slide-down fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-600/90 px-5 py-3 text-white shadow-lg backdrop-blur-md">
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="text-sm font-medium">Welcome to Pro! 🎉 Your upgrade is active.</span>
        <button onClick={onDismiss} className="ml-1 text-white/70 hover:text-white">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DataSourceToggle({
  value,
  onChange,
}: {
  value: DataSource;
  onChange: (value: DataSource) => void;
}) {
  const { isConnected, xHandle, isChecking } = useXAuth();

  return (
    <div className="border-b border-[rgb(47,51,54)] px-4 py-3">
      <div className="inline-flex rounded-full bg-[rgb(22,24,28)] p-1">
        <button
          type="button"
          onClick={() => onChange("stash")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === "stash"
              ? "bg-[rgb(29,155,240)] text-white"
              : "text-[rgb(113,118,123)] hover:text-white"
          }`}
        >
          My Stash
        </button>
        <button
          type="button"
          onClick={() => onChange("bookmarks")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === "bookmarks"
              ? "bg-[rgb(29,155,240)] text-white"
              : "text-[rgb(113,118,123)] hover:text-white"
          }`}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X Bookmarks
        </button>
      </div>

      <div className="mt-2 text-xs text-[rgb(113,118,123)]">
        {isChecking ? (
          <span>Checking X connection...</span>
        ) : isConnected ? (
          <div className="flex items-center gap-2">
            <span>Connected {xHandle ? `as @${xHandle}` : "to X"}</span>
            <form action="/api/auth/twitter/disconnect" method="post">
              <button className="rounded-full border border-[rgb(47,51,54)] px-2 py-0.5 text-[11px] font-medium text-[rgb(113,118,123)] hover:border-[rgb(90,94,98)] hover:text-white">
                Disconnect
              </button>
            </form>
          </div>
        ) : (
          <span>Not connected</span>
        )}
      </div>
    </div>
  );
}

function HomeContent() {
  const { view } = useView();
  const { checkStatus } = useXAuth();
  const searchParams = useSearchParams();
  const [showPricing, setShowPricing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>("stash");
  const [articleUrl, setArticleUrl] = useState<string | null>(null);
  const [articleTweet, setArticleTweet] = useState<Tweet | null>(null);

  const isDigest = view === "digest";
  const isFacebook = view === "facebook";

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    const upgraded = searchParams.get("upgraded") === "true";
    const cancelled = searchParams.get("cancelled") === "true";
    const xConnected = searchParams.get("xConnected");

    if (upgraded) {
      setShowSuccess(true);
    }

    if (xConnected === "1") {
      setDataSource("bookmarks");
      checkStatus();
    }

    if (upgraded || cancelled || xConnected === "1" || xConnected === "0") {
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, checkStatus]);

  const handleOnboardingClose = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  const twitterTitle = useMemo(
    () => (dataSource === "bookmarks" ? "X Bookmarks" : "Saved Tweets"),
    [dataSource]
  );

  const handleArticleClick = (url: string, tweet: Tweet) => {
    setArticleUrl(url);
    setArticleTweet(tweet);
  };

  const closeArticleReader = () => {
    setArticleUrl(null);
    setArticleTweet(null);
  };

  const handleSourceChange = (nextSource: DataSource) => {
    setDataSource(nextSource);
    closeArticleReader();
  };

  return (
    <>
      {showSuccess && <SuccessToast onDismiss={() => setShowSuccess(false)} />}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />

      <main className="min-h-screen">
        <LeftSidebar onShowOnboarding={() => setShowOnboarding(true)} />

        {isDigest ? (
          <div className="pb-16 transition-all duration-200 md:ml-[68px] md:pb-0 lg:ml-[240px]">
            <SubstackLayout />
          </div>
        ) : isFacebook ? (
          <div className="pb-16 transition-all duration-200 md:ml-[68px] md:pb-0 lg:ml-[240px]">
            <FacebookLayout>
              <TweetFeed cardComponent={FacebookCard} dataSource="stash" />
              <UpgradeBanner onLearnMore={() => setShowPricing(true)} />
            </FacebookLayout>
          </div>
        ) : (
          <div className="pb-16 transition-all duration-200 md:ml-[68px] md:pb-0 lg:ml-[240px]">
            <div className="mx-auto min-h-screen max-w-[600px] border-x border-[rgb(47,51,54)]">
              <header className="sticky top-0 z-10 border-b border-[rgb(47,51,54)] bg-black/80 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <h1 className="text-xl font-bold text-white">{twitterTitle}</h1>
                </div>
              </header>

              <DataSourceToggle value={dataSource} onChange={handleSourceChange} />

              <TweetFeed
                cardComponent={TweetCard}
                dataSource={dataSource}
                onArticleClick={handleArticleClick}
              />

              <UpgradeBanner onLearnMore={() => setShowPricing(true)} />
            </div>
          </div>
        )}
      </main>

      {articleUrl && (
        <ArticleReaderView
          articleUrl={articleUrl}
          tweet={articleTweet}
          onClose={closeArticleReader}
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <XAuthProvider>
        <HomeContent />
      </XAuthProvider>
    </Suspense>
  );
}
