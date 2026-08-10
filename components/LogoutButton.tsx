"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

export default function LogoutButton() {
  const { signOut } = useClerk();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await signOut({
        redirectUrl: "/login",
      });
    } catch (error) {
      console.error("Failed to log out:", error);
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {loggingOut ? "Logging out..." : "Log Out"}
    </button>
  );
}