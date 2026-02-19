"use client";

export default function XConnectBanner() {
  return (
    <div className="mx-4 my-4 rounded-2xl border border-[rgb(47,51,54)] bg-[rgb(10,12,15)] p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">Connect your X account</h3>
          <p className="mt-1 text-sm text-[rgb(113,118,123)]">
            Switch on live bookmarks and engagement stats from your own X account.
          </p>
          <a
            href="/api/auth/twitter"
            className="mt-4 inline-flex items-center rounded-full bg-[rgb(29,155,240)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[rgb(26,140,216)]"
          >
            Connect X Account
          </a>
        </div>
      </div>
    </div>
  );
}
