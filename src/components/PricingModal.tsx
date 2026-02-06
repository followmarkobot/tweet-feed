"use client";

import { useState, useEffect, useCallback } from "react";
import { useView } from "../contexts/ViewContext";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const freeFeatures = [
  { text: "Latest 30 posts", included: true },
  { text: "Basic search", included: true },
  { text: "Twitter & Facebook views", included: true },
  { text: "Unlimited archive", included: false },
  { text: "AI summaries", included: false },
  { text: "Collections & tags", included: false },
  { text: "Export anytime", included: false },
  { text: "Advanced search", included: false },
  { text: "Priority support", included: false },
];

const proFeatures = [
  { text: "Latest 30 posts", included: true },
  { text: "Basic search", included: true },
  { text: "Twitter & Facebook views", included: true },
  { text: "Unlimited archive", included: true },
  { text: "AI summaries", included: true },
  { text: "Collections & tags", included: true },
  { text: "Export anytime", included: true },
  { text: "Advanced search", included: true },
  { text: "Priority support", included: true },
];

function CheckIcon({ included, accentColor }: { included: boolean; accentColor: string }) {
  if (!included) {
    return (
      <svg className="w-5 h-5 text-[rgb(113,118,123)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { view } = useView();
  const [loading, setLoading] = useState(false);

  const isFacebook = view === "facebook";
  const accentColor = isFacebook ? "rgb(66,133,244)" : "rgb(29,155,240)";

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  const handleCheckout = async () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-[rgb(47,51,54)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, rgba(22,22,22,0.95) 0%, rgba(30,30,30,0.98) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[rgb(113,118,123)] hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Choose your plan</h2>
          <p className="text-[rgb(113,118,123)] text-sm mt-2">
            Unlock the full power of your saved content
          </p>
        </div>

        {/* Plans comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free tier */}
          <div className="rounded-xl border border-[rgb(47,51,54)] p-5 bg-[rgb(22,24,28)]/50">
            <h3 className="text-lg font-bold text-white">Free</h3>
            <div className="mt-2 mb-5">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-[rgb(113,118,123)] text-sm">/mo</span>
            </div>
            <ul className="space-y-3">
              {freeFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5">
                  <CheckIcon included={f.included} accentColor={accentColor} />
                  <span className={f.included ? "text-white text-sm" : "text-[rgb(113,118,123)] text-sm line-through"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="w-full mt-6 py-2.5 rounded-full border border-[rgb(47,51,54)] text-white text-sm font-bold hover:bg-[rgb(47,51,54)] transition-colors"
              disabled
            >
              Current plan
            </button>
          </div>

          {/* Pro tier */}
          <div
            className="rounded-xl border-2 p-5 relative"
            style={{
              borderColor: accentColor,
              background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}04 100%)`,
            }}
          >
            {/* Badge */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              RECOMMENDED
            </div>

            <h3 className="text-lg font-bold text-white mt-1">Pro</h3>
            <div className="mt-2 mb-5">
              <span className="text-3xl font-bold text-white">$9</span>
              <span className="text-[rgb(113,118,123)] text-sm">/mo</span>
            </div>
            <ul className="space-y-3">
              {proFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5">
                  <CheckIcon included={f.included} accentColor={accentColor} />
                  <span className="text-white text-sm">{f.text}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading…
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[rgb(113,118,123)] text-xs mt-6">
          Cancel anytime. Powered by Stripe. Prices in USD.
        </p>
      </div>
    </div>
  );
}
