"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClaimFoodButtonProps = {
  foodId: number;
};

export default function ClaimFoodButton({
  foodId,
}: ClaimFoodButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClaim() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Failed to claim this food."
        );
        return;
      }

      router.push(`/claim/${foodId}/success`);
    } catch (error) {
      console.error("Claim request failed:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClaim}
        disabled={loading}
        className="w-full rounded-xl bg-[#198754] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#157347] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending Request..." : "Request This Food"}
      </button>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}