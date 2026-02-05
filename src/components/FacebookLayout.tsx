"use client";

import { ReactNode } from "react";
import { useView } from "../contexts/ViewContext";

/* ─── SVG icon helpers ─── */
function FBLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg className={`w-6 h-6 ${active ? "text-[rgb(66,133,244)]" : "text-[rgb(176,179,184)]"}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.464 3.09c1.262-1.12 3.21-1.12 4.472 0l5.6 4.977c.783.696 1.228 1.706 1.228 2.766V19.5A1.75 1.75 0 0 1 19.014 21.25h-3.278a1.75 1.75 0 0 1-1.75-1.75v-3.75a.25.25 0 0 0-.25-.25H10.264a.25.25 0 0 0-.25.25v3.75a1.75 1.75 0 0 1-1.75 1.75H4.986A1.75 1.75 0 0 1 3.236 19.5v-8.667c0-1.06.445-2.07 1.228-2.766l5-4.977z" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="w-6 h-6 text-[rgb(176,179,184)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}

function MarketplaceIcon() {
  return (
    <svg className="w-6 h-6 text-[rgb(176,179,184)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
    </svg>
  );
}

function GroupsIcon() {
  return (
    <svg className="w-6 h-6 text-[rgb(176,179,184)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function GamingIcon() {
  return (
    <svg className="w-6 h-6 text-[rgb(176,179,184)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.491 48.491 0 0 0-4.163.3c-1.11.143-1.931 1.082-1.931 2.2V10.5M21.75 12a2.25 2.25 0 0 0-2.25-2.25H15a2.25 2.25 0 0 0-2.25 2.25M21.75 12v7.5m0-7.5V12a2.25 2.25 0 0 0-2.25-2.25H15a2.25 2.25 0 0 0-2.25 2.25m0 0V21m0-9v-1.5m0 1.5v7.5m0-7.5h-3M3 12h3m3 0V9.5M9 12v7.5m0-7.5H6M3 12v7.5m0-7.5V10.5m0 9h18" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ─── Main Component ─── */
export default function FacebookLayout({ children }: { children: ReactNode }) {
  const { setView } = useView();

  return (
    <div className="min-h-screen bg-[rgb(24,25,26)]">
      {/* ══════════ TOP NAVBAR ══════════ */}
      <header className="fixed top-0 left-0 md:left-[68px] lg:left-[240px] right-0 z-40 h-14 bg-[rgb(36,37,38)] border-b border-[rgb(58,59,60)] flex items-center px-4 gap-2 transition-all duration-200">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <FBLogo className="w-10 h-10 text-[rgb(66,133,244)]" />
        </div>

        {/* Search */}
        <div className="hidden sm:flex items-center bg-[rgb(58,59,60)] rounded-full px-3 py-2 ml-2 w-[240px]">
          <SearchIcon className="w-4 h-4 text-[rgb(176,179,184)] shrink-0" />
          <input
            type="text"
            placeholder="Search Facebook"
            className="bg-transparent text-white placeholder-[rgb(176,179,184)] text-sm ml-2 outline-none w-full"
          />
        </div>

        {/* Center nav icons (desktop) */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-1">
          {[
            { icon: <HomeIcon active />, label: "Home", active: true },
            { icon: <VideoIcon />, label: "Video" },
            { icon: <MarketplaceIcon />, label: "Marketplace" },
            { icon: <GroupsIcon />, label: "Groups" },
            { icon: <GamingIcon />, label: "Gaming" },
          ].map((item) => (
            <button
              key={item.label}
              className={`relative flex items-center justify-center w-[112px] h-12 rounded-lg transition-colors ${
                item.active
                  ? "text-[rgb(66,133,244)]"
                  : "text-[rgb(176,179,184)] hover:bg-[rgb(58,59,60)]"
              }`}
              title={item.label}
            >
              {item.icon}
              {item.active && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[rgb(66,133,244)] rounded-t-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Switch to Twitter button */}
          <button
            onClick={() => setView("twitter")}
            className="flex items-center gap-1.5 bg-[rgb(58,59,60)] hover:bg-[rgb(70,72,74)] text-white rounded-full px-3 py-1.5 transition-colors text-sm font-medium"
            title="Switch to Twitter view"
          >
            <XLogo className="w-4 h-4" />
            <span className="hidden sm:inline">Twitter</span>
          </button>

          {/* Menu dot */}
          <button className="w-10 h-10 rounded-full bg-[rgb(58,59,60)] hover:bg-[rgb(70,72,74)] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-[rgb(228,230,235)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" />
            </svg>
          </button>

          {/* Messenger */}
          <button className="w-10 h-10 rounded-full bg-[rgb(58,59,60)] hover:bg-[rgb(70,72,74)] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-[rgb(228,230,235)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.24.16.15.26.36.27.58l.05 1.82c.02.56.6.92 1.1.69l2.03-.9c.17-.07.36-.1.55-.06.89.24 1.84.37 2.85.37 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2Zm5.99 7.59-2.93 4.65c-.47.74-1.44.93-2.13.41l-2.33-1.75a.6.6 0 0 0-.72 0L7.4 14.78c-.39.3-.9-.18-.64-.6l2.93-4.65c.47-.74 1.44-.93 2.13-.41l2.33 1.75a.6.6 0 0 0 .72 0l2.48-1.88c.39-.3.9.18.64.6Z" />
            </svg>
          </button>

          {/* Notifications */}
          <button className="w-10 h-10 rounded-full bg-[rgb(58,59,60)] hover:bg-[rgb(70,72,74)] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-[rgb(228,230,235)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a7.49 7.49 0 0 0-7.5 7.5c0 3.08-1.13 4.55-1.97 5.44a.75.75 0 0 0 .56 1.31h17.82a.75.75 0 0 0 .56-1.31c-.84-.89-1.97-2.36-1.97-5.44A7.49 7.49 0 0 0 12 2ZM9 20.25a3 3 0 0 0 6 0H9Z" />
            </svg>
          </button>

          {/* Avatar */}
          <button className="w-10 h-10 rounded-full bg-[rgb(58,59,60)] hover:bg-[rgb(70,72,74)] flex items-center justify-center transition-colors overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
          </button>
        </div>
      </header>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="pt-14 min-h-screen">
        <div className="max-w-[680px] mx-auto px-4 py-6">
          {/* Create post box */}
          <div className="bg-[rgb(36,37,38)] rounded-lg p-3 mb-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                S
              </div>
              <button className="flex-1 text-left bg-[rgb(58,59,60)] hover:bg-[rgb(70,72,74)] rounded-full px-4 py-2.5 text-[rgb(176,179,184)] text-[15px] transition-colors">
                What&apos;s on your mind?
              </button>
            </div>
            <div className="border-t border-[rgb(58,59,60)] mt-3 pt-3 flex items-center">
              <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[rgb(58,59,60)] transition-colors">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-[rgb(176,179,184)] text-sm font-medium">Live video</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[rgb(58,59,60)] transition-colors">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[rgb(176,179,184)] text-sm font-medium">Photo/video</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[rgb(58,59,60)] transition-colors">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[rgb(176,179,184)] text-sm font-medium">Feeling/activity</span>
              </button>
            </div>
          </div>

          {/* Feed content */}
          {children}
        </div>
      </main>

      {/* Mobile bottom nav handled by LeftSidebar */}
    </div>
  );
}
