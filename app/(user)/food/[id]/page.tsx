import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { foodPosts, users } from "@/lib/schema";

type FoodDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FoodDetailsPage({
  params,
}: FoodDetailsPageProps) {
  const { id } = await params;

  const foodId = Number(id);

  if (!Number.isInteger(foodId)) {
    notFound();
  }

  const [food] = await db
    .select({
      id: foodPosts.id,
      title: foodPosts.title,
      description: foodPosts.description,
      image: foodPosts.image,
      foodType: foodPosts.foodType,
      quantity: foodPosts.quantity,
      location: foodPosts.location,
      availableUntil: foodPosts.availableUntil,
      status: foodPosts.status,
      createdAt: foodPosts.createdAt,
      userName: users.name,
    })
    .from(foodPosts)
    .leftJoin(users, eq(foodPosts.userId, users.id))
    .where(eq(foodPosts.id, foodId))
    .limit(1);

  if (!food) {
    notFound();
  }

  const now = new Date();

  const isExpired =
    new Date(food.availableUntil) <= now;

  const isAvailable =
    food.status === "available" && !isExpired;

  const availableUntil = new Date(
    food.availableUntil
  ).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const postedDate = food.createdAt
    ? new Date(food.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "";

  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#151b17]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/home"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#198754] text-xl text-white">
              ♥
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#151b17]">
                HelpMeal
              </h1>

              <p className="text-xs text-gray-500">
                Food • Share • Help
              </p>
            </div>
          </Link>

          <Link
            href="/home"
            className="text-sm font-medium text-gray-600 transition hover:text-[#198754]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* =====================================================
          FOOD DETAILS
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            {/* =================================================
                FOOD IMAGE
            ================================================= */}

            <div className="min-h-[420px] bg-gray-100">
              {food.image ? (
                <img
                  src={food.image}
                  alt={food.title}
                  className="h-full min-h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[420px] items-center justify-center bg-gradient-to-br from-[#eaf5ec] to-[#f5f8f5] text-8xl">
                  🍱
                </div>
              )}
            </div>

            {/* =================================================
                FOOD INFORMATION
            ================================================= */}

            <div className="p-7 md:p-10">
              {/* Status */}

              <div className="flex items-center justify-between gap-4">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isAvailable
                      ? "bg-[#eaf5ec] text-[#198754]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isAvailable
                    ? "Available"
                    : isExpired
                      ? "Expired"
                      : "Not Available"}
                </span>

                <span className="text-sm text-gray-400">
                  Posted {postedDate}
                </span>
              </div>

              {/* Title */}

              <h2 className="mt-6 text-4xl font-bold leading-tight text-[#151b17]">
                {food.title}
              </h2>

              {/* Description */}

              <p className="mt-4 leading-7 text-gray-600">
                {food.description ||
                  "No description provided."}
              </p>

              {/* =================================================
                  EXPIRED MESSAGE
              ================================================= */}

              {isExpired && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-200">
                      ⏰
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        This food is no longer available
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        The availability time for this food
                        has passed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  FOOD INFORMATION
              ================================================= */}

              <div className="mt-8 space-y-5 border-y border-gray-100 py-6">
                {/* Food Type */}

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ec]">
                    🍽️
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Food type
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {food.foodType}
                    </p>
                  </div>
                </div>

                {/* Quantity */}

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ec]">
                    📦
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Quantity
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {food.quantity}
                    </p>
                  </div>
                </div>

                {/* Location */}

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ec]">
                    📍
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Pickup location
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {food.location}
                    </p>
                  </div>
                </div>

                {/* Available Until */}

                <div className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isAvailable
                        ? "bg-[#eaf5ec]"
                        : "bg-gray-100"
                    }`}
                  >
                    ⏰
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Available until
                    </p>

                    <p
                      className={`mt-1 font-semibold ${
                        isExpired
                          ? "text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {availableUntil}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  POSTED BY
              ================================================= */}

              <div className="mt-6">
                <p className="text-xs text-gray-400">
                  Shared by
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {food.userName ||
                    "HelpMeal User"}
                </p>
              </div>

              {/* =================================================
                  CLAIM BUTTON
              ================================================= */}

              {isAvailable ? (
                <Link
                  href={`/claim/${food.id}`}
                  className="mt-8 block w-full rounded-xl bg-[#198754] py-4 text-center font-semibold text-white transition hover:bg-[#157347]"
                >
                  Claim This Food
                </Link>
              ) : (
                <div className="mt-8">
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-gray-200 py-4 font-semibold text-gray-500"
                  >
                    {isExpired
                      ? "Food Has Expired"
                      : "Food No Longer Available"}
                  </button>

                  <Link
                    href="/home"
                    className="mt-3 block text-center text-sm font-semibold text-[#198754] hover:underline"
                  >
                    Find Other Food
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}