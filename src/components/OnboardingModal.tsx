"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: (wentPro?: boolean) => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isVisible, setIsVisible] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const prevStepRef = useRef(step);

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger entrance animation
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(false);
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  const goToStep = (newStep: number) => {
    setDirection(newStep > step ? "next" : "prev");
    prevStepRef.current = step;
    setStep(newStep);
    setContentKey((k) => k + 1);
  };

  const handleStartFree = () => {
    onClose(false);
  };

  const handleGoPro = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const slideClass = direction === "next" ? "animate-slideInRight" : "animate-slideInLeft";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onClose(false)}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl border border-[rgb(47,51,54)] overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        style={{
          background: "rgb(24,25,26)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 z-10 text-[rgb(113,118,123)] hover:text-white transition-all duration-200 p-1.5 rounded-full hover:bg-[rgb(47,51,54)] hover:scale-110"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 min-h-[440px] flex flex-col">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div key={`step1-${contentKey}`} className={`flex-1 flex flex-col items-center justify-center text-center ${slideClass}`}>
              {/* Icon with floating animation */}
              <div className="mb-6 relative animate-float">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgb(29,155,240)] to-[rgb(120,86,255)] flex items-center justify-center shadow-lg shadow-[rgb(29,155,240)]/25">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                  </svg>
                </div>
                {/* Sparkle accents */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[rgb(29,155,240)] rounded-full animate-sparkle" />
                <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-[rgb(120,86,255)] rounded-full animate-sparkle-delayed" />
                <div className="absolute top-2 -left-3 w-1.5 h-1.5 bg-white/60 rounded-full animate-sparkle" />
              </div>

              <h2 
                className="text-2xl font-bold text-white mb-3 animate-stagger-1"
              >
                AI tips that actually work
              </h2>
              <p 
                className="text-[rgb(156,163,175)] text-base mb-8 max-w-xs animate-stagger-2"
              >
                Learn to use AI tools in 15 min/day — not 2 hours of scrolling
              </p>

              <button
                onClick={() => goToStep(2)}
                className="w-full max-w-xs py-3.5 rounded-full bg-[rgb(29,155,240)] text-white font-bold text-sm transition-all duration-200 hover:bg-[rgb(26,140,216)] hover:scale-[1.02] hover:shadow-lg hover:shadow-[rgb(29,155,240)]/25 active:scale-[0.98] animate-stagger-3"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Step 2: How it works */}
          {step === 2 && (
            <div key={`step2-${contentKey}`} className={`flex-1 flex flex-col items-center justify-center ${slideClass}`}>
              <h2 className="text-xl font-bold text-white mb-8 text-center animate-stagger-1">
                How it works
              </h2>

              <div className="space-y-5 w-full max-w-xs mb-8">
                <div className="flex items-start gap-4 animate-stagger-1">
                  <span className="text-2xl animate-bounce-subtle">🎯</span>
                  <div>
                    <p className="text-white text-sm font-medium">Handpicked posts from AI practitioners</p>
                    <p className="text-[rgb(113,118,123)] text-xs mt-0.5">Only the best content makes the cut</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 animate-stagger-2">
                  <span className="text-2xl animate-bounce-subtle" style={{ animationDelay: "0.1s" }}>🧠</span>
                  <div>
                    <p className="text-white text-sm font-medium">AI summaries tell you the key takeaway</p>
                    <p className="text-[rgb(113,118,123)] text-xs mt-0.5">Get insights in seconds, not minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 animate-stagger-3">
                  <span className="text-2xl animate-bounce-subtle" style={{ animationDelay: "0.2s" }}>📚</span>
                  <div>
                    <p className="text-white text-sm font-medium">Learning paths guide you step by step</p>
                    <p className="text-[rgb(113,118,123)] text-xs mt-0.5">From beginner to pro, structured</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => goToStep(3)}
                className="w-full max-w-xs py-3.5 rounded-full bg-[rgb(29,155,240)] text-white font-bold text-sm transition-all duration-200 hover:bg-[rgb(26,140,216)] hover:scale-[1.02] hover:shadow-lg hover:shadow-[rgb(29,155,240)]/25 active:scale-[0.98] animate-stagger-4"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 3: Free vs Pro */}
          {step === 3 && (
            <div key={`step3-${contentKey}`} className={`flex-1 flex flex-col ${slideClass}`}>
              <h2 className="text-xl font-bold text-white mb-6 text-center animate-stagger-1">
                Choose your path
              </h2>

              <div className="space-y-4 flex-1">
                {/* Free tier */}
                <div className="rounded-xl border border-[rgb(47,51,54)] p-4 bg-[rgb(36,37,38)] transition-all duration-200 hover:border-[rgb(71,75,80)] animate-stagger-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">Free</h3>
                    <span className="text-[rgb(113,118,123)] text-sm">$0/mo</span>
                  </div>
                  <p className="text-[rgb(113,118,123)] text-sm">
                    Browse the latest 30 posts
                  </p>
                </div>

                {/* Pro tier */}
                <div className="rounded-xl border-2 border-[rgb(29,155,240)] p-4 bg-gradient-to-br from-[rgb(29,155,240)]/10 to-transparent relative transition-all duration-200 hover:border-[rgb(29,155,240)] hover:shadow-lg hover:shadow-[rgb(29,155,240)]/10 animate-stagger-3">
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-[rgb(29,155,240)] text-[10px] font-bold text-white animate-pulse-subtle">
                    BEST VALUE
                  </div>
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <h3 className="text-white font-bold">Pro</h3>
                    <span className="text-white text-sm font-medium">$9/mo</span>
                  </div>
                  <ul className="space-y-1.5">
                    {["Full archive access", "AI summaries", "Learning paths", "Weekly digest email"].map((feature, i) => (
                      <li key={feature} className="flex items-center gap-2 text-[rgb(200,200,200)] text-sm" style={{ animationDelay: `${0.4 + i * 0.05}s` }}>
                        <svg className="w-4 h-4 text-[rgb(29,155,240)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mt-6 animate-stagger-4">
                <button
                  onClick={handleGoPro}
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[rgb(29,155,240)] to-[rgb(120,86,255)] text-white font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] hover:shadow-lg hover:shadow-[rgb(29,155,240)]/25 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting…
                    </span>
                  ) : (
                    "Go Pro — $9/mo"
                  )}
                </button>
                <button
                  onClick={handleStartFree}
                  className="w-full py-3.5 rounded-full border border-[rgb(47,51,54)] text-white font-medium text-sm transition-all duration-200 hover:bg-[rgb(47,51,54)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Free
                </button>
              </div>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => goToStep(s)}
                className={`h-2 rounded-full transition-all duration-300 ease-out ${
                  step === s
                    ? "bg-[rgb(29,155,240)] w-6 shadow-md shadow-[rgb(29,155,240)]/50"
                    : "bg-[rgb(47,51,54)] w-2 hover:bg-[rgb(71,75,80)] hover:scale-125"
                }`}
                aria-label={`Go to step ${s}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }
        @keyframes bounceSoft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes pulseSoft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.35s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.35s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .animate-sparkle-delayed {
          animation: sparkle 2s ease-in-out infinite 0.5s;
        }
        .animate-bounce-subtle {
          animation: bounceSoft 2s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulseSoft 2s ease-in-out infinite;
        }
        .animate-stagger-1 {
          animation: slideInRight 0.35s ease-out;
          animation-delay: 0.05s;
          animation-fill-mode: both;
        }
        .animate-stagger-2 {
          animation: slideInRight 0.35s ease-out;
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }
        .animate-stagger-3 {
          animation: slideInRight 0.35s ease-out;
          animation-delay: 0.15s;
          animation-fill-mode: both;
        }
        .animate-stagger-4 {
          animation: slideInRight 0.35s ease-out;
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
