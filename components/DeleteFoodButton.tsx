"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteFoodButtonProps = {
  foodId: number;
};

export default function DeleteFoodButton({
  foodId,
}: DeleteFoodButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/food/${foodId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete food post.");
        setLoading(false);
        return;
      }

      setIsOpen(false);

      router.push("/my-posts");
      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);

      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="flex-1 rounded-xl border border-red-200 py-2.5 text-center text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl">
              🗑️
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#151b17]">
              Delete this food post?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              This will permanently remove the food post.
              This action cannot be undone.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}