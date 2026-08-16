"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: number;
  claimId: number | null;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      const response = await fetch("/api/notifications");

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load notifications");
        return;
      }

      setNotifications(data.notifications || []);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function respondToClaim(
    claimId: number,
    action: "approve" | "deny",
    notificationId: number
  ) {
    if (processingId) return;

    setProcessingId(notificationId);
    setError("");

    try {
      const response = await fetch(
        `/api/claims/${claimId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to process request");
        return;
      }

      // Remove processed notification from the list
      setNotifications((current) =>
        current.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      {/* Navbar */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold text-[#151b17]">
              HelpMeal
            </h1>

            <p className="text-xs text-gray-500">
              Food • Share • Help
            </p>
          </div>

          <a
            href="/home"
            className="text-sm font-medium text-gray-600 transition hover:text-[#198754]"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Notifications */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#198754]">
            Notifications
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#151b17]">
            Your Requests
          </h2>

          <p className="mt-2 text-gray-500">
            Manage requests from people who want to claim your food.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf5ec] text-3xl">
              🔔
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[#151b17]">
              No notifications
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              You don't have any food requests right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const isClaimRequest =
                notification.type === "claim_request";

              const isProcessing =
                processingId === notification.id;

              return (
                <div
                  key={notification.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ec] text-xl">
                      🔔
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold text-[#151b17]">
                          {notification.title}
                        </h3>

                        <span className="text-xs text-gray-400">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <p className="mt-2 leading-6 text-gray-600">
                        {notification.message}
                      </p>

                      {isClaimRequest &&
                        notification.claimId && (
                          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                respondToClaim(
                                  notification.claimId!,
                                  "approve",
                                  notification.id
                                )
                              }
                              className="rounded-xl bg-[#198754] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#157347] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Allow"}
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                respondToClaim(
                                  notification.claimId!,
                                  "deny",
                                  notification.id
                                )
                              }
                              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}