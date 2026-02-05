"use client";

import { useView, ViewMode } from "../contexts/ViewContext";

const navItems: { id: ViewMode; label: string }[] = [
  { id: "twitter", label: "Twitter" },
  { id: "facebook", label: "Facebook" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function LeftSidebar() {
  const { view, setView } = useView();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen z-30 flex-col border-r border-[rgb(47,51,54)] bg-black group w-[68px] hover:w-[240px] lg:w-[240px] transition-all duration-200 overflow-hidden">
        {/* Logo area */}
        <div className="px-4 py-5 flex items-center gap-3 shrink-0">
          <svg
            className="w-8 h-8 text-white shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-white font-bold text-lg whitespace-nowrap opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-200">
            Saved Tweets
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${
                  isActive
                    ? "text-white font-bold"
                    : "text-[rgb(231,233,234)] hover:bg-[rgb(22,24,28)]"
                }`}
              >
                <div className="relative shrink-0 w-7 h-7 flex items-center justify-center">
                  {item.id === "twitter" ? (
                    <XIcon
                      className={`w-6 h-6 ${
                        isActive ? "text-[rgb(29,155,240)]" : "text-current"
                      }`}
                    />
                  ) : (
                    <FacebookIcon
                      className={`w-6 h-6 ${
                        isActive ? "text-[rgb(29,155,240)]" : "text-current"
                      }`}
                    />
                  )}
                  {isActive && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[rgb(29,155,240)] rounded-full" />
                  )}
                </div>
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-200 text-[15px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-4 py-4 border-t border-[rgb(47,51,54)] shrink-0">
          <p className="text-[rgb(113,118,123)] text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-200">
            Saved Tweets Viewer
          </p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black border-t border-[rgb(47,51,54)] flex">
        {navItems.map((item) => {
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive
                  ? "text-[rgb(29,155,240)]"
                  : "text-[rgb(113,118,123)]"
              }`}
            >
              {item.id === "twitter" ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <FacebookIcon className="w-6 h-6" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
