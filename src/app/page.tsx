"use client";

import { Suspense, useState, useEffect } from "react";
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
import { useView } from "../contexts/ViewContext";

export const dynamic = "force-dynamic";

function SuccessToast({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="flex items-center gap-3 bg-green-600/90 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-lg border border-green-500/30">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">Welcome to Pro! 🎉 Your upgrade is active.</span>
        <button onClick={onDismiss} className="text-white/70 hover:text-white ml-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function HomeContent() {
  const { view } = useView();
  const searchParams = useSearchParams();
  const [showPricing, setShowPricing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const isDigest = view === "digest";
  const isFacebook = view === "facebook";

  // Check for first visit and show onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setShowSuccess(true);
      // Clean URL without reload
      window.history.replaceState({}, "", "/");
    }
    if (searchParams.get("cancelled") === "true") {
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  const handleOnboardingClose = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  return (
    <>
      {showSuccess && <SuccessToast onDismiss={() => setShowSuccess(false)} />}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />

      <main className="min-h-screen">
        {/* Left sidebar always visible */}
        <LeftSidebar onShowOnboarding={() => setShowOnboarding(true)} />

        {isDigest ? (
          /* ─── Digest view: Substack-style newsletter layout ─── */
          <div className="md:ml-[68px] lg:ml-[240px] transition-all duration-200 pb-16 md:pb-0">
            <SubstackLayout />
          </div>
        ) : isFacebook ? (
          /* ─── Facebook view: full immersive layout, offset for sidebar ─── */
          <div className="md:ml-[68px] lg:ml-[240px] transition-all duration-200 pb-16 md:pb-0">
            <FacebookLayout>
              <TweetFeed cardComponent={FacebookCard} />
              <UpgradeBanner onLearnMore={() => setShowPricing(true)} />
            </FacebookLayout>
          </div>
        ) : (
          /* ─── Twitter view ─── */
          <div className="md:ml-[68px] lg:ml-[240px] transition-all duration-200 pb-16 md:pb-0">
            <div className="mx-auto min-h-screen max-w-[600px] border-x border-[rgb(47,51,54)]">
              {/* Header */}
              <header className="sticky top-0 z-10 backdrop-blur-md border-b border-[rgb(47,51,54)] px-4 py-3 bg-black/80">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <h1 className="text-xl font-bold text-white">Saved Tweets</h1>
                </div>
              </header>

              {/* Feed */}
              <TweetFeed cardComponent={TweetCard} />

              {/* Upgrade banner */}
              <UpgradeBanner onLearnMore={() => setShowPricing(true)} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
