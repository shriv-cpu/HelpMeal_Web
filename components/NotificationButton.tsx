
"use client";


import Link from "next/link";

export default function NotificationButton() {
  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl transition hover:bg-gray-50"
    >
      🔔
    </Link>
  );
}