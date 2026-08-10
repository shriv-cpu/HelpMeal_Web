import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";
import { foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

import ClaimFoodButton from "@/components/ClaimFoodButton";

type ClaimPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClaimPage({
  params,
}: ClaimPageProps) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const user = await getOrCreateUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const foodId = Number(id);

  if (!Number.isInteger(foodId)) {
    notFound();
  }

  const [food] = await db
    .select()
    .from(foodPosts)
    .where(eq(foodPosts.id, foodId))
    .limit(1);

  if (!food) {
    notFound();
  }

  const now = new Date();

  const isOwner = food.userId === user.id;

  const isExpired =
    new Date(food.availableUntil) <= now;

  const isClaimed =
    food.status !== "available";

  const canClaim =
    !isOwner &&
    !isExpired &&
    !isClaimed;

  const availableUntil = new Date(
    food.availableUntil
  ).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#198754] text-xl text-white shadow-sm">
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
            href={`/food/${food.id}`}
            className="text-sm font-medium text-gray-600 transition hover:text-[#198754]"
          >
            ← Back to Food
          </Link>
        </div>
      </header>

      {/* =====================================================
          CLAIM PAGE
      ===================================================== */}

      <section className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        {/* Page heading */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#198754]">
            Food Claim
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#151b17] sm:text-4xl">
            Review before claiming
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Make sure the food details and pickup
            information work for you before confirming
            your claim.
          </p>
        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Image */}

          <div className="relative h-72 bg-gray-100">
            {food.image ? (
              <img
                src={food.image}
                alt={food.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eaf5ec] to-[#f5f8f5] text-7xl">
                🍱
              </div>
            )}

            {/* Status badge */}

            <div className="absolute left-5 top-5">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                  food.status === "available" &&
                  !isExpired
                    ? "bg-white text-[#198754]"
                    : "bg-white text-gray-500"
                }`}
              >
                {isOwner
                  ? "Your Food"
                  : isExpired
                    ? "Expired"
                    : isClaimed
                      ? "Claimed"
                      : "Available"}
              </span>
            </div>
          </div>

          {/* Content */}

          <div className="p-7 sm:p-9">
            {/* Title */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#198754]">
                  {food.foodType}
                </p>

                <h3 className="mt-2 text-3xl font-bold leading-tight text-[#151b17]">
                  {food.title}
                </h3>
              </div>
            </div>

            {/* Description */}

            {food.description && (
              <p className="mt-4 leading-7 text-gray-600">
                {food.description}
              </p>
            )}

            {/* =================================================
                DETAILS
            ================================================= */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {/* Quantity */}

              <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5ec]">
                    📦
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Quantity
                    </p>

                    <p className="mt-1 font-semibold text-[#151b17]">
                      {food.quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Food type */}

              <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5ec]">
                    🍽️
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Food type
                    </p>

                    <p className="mt-1 font-semibold text-[#151b17]">
                      {food.foodType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}

              <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-5 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ec]">
                    📍
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Pickup location
                    </p>

                    <p className="mt-1 font-semibold text-[#151b17]">
                      {food.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available until */}

              <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-5 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isExpired
                        ? "bg-gray-100"
                        : "bg-[#eaf5ec]"
                    }`}
                  >
                    ⏰
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Available until
                    </p>

                    <p
                      className={`mt-1 font-semibold ${
                        isExpired
                          ? "text-gray-500"
                          : "text-[#151b17]"
                      }`}
                    >
                      {availableUntil}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                CLAIM AREA
            ================================================= */}

            <div className="mt-8 border-t border-gray-100 pt-8">
              {isOwner ? (
                <div className="rounded-2xl border border-gray-200 bg-[#f8faf8] p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 text-xl">
                    📦
                  </div>

                  <h4 className="mt-4 font-semibold text-[#151b17]">
                    This is your food post
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    You cannot claim food that you
                    posted yourself.
                  </p>

                  <Link
                    href={`/edit-post/${food.id}`}
                    className="mt-5 inline-block rounded-xl bg-[#198754] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#157347]"
                  >
                    Manage Your Post
                  </Link>
                </div>
              ) : isExpired ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 text-xl">
                    ⏰
                  </div>

                  <h4 className="mt-4 font-semibold text-gray-700">
                    This food has expired
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    The available time for this food has
                    passed, so it can no longer be claimed.
                  </p>

                  <Link
                    href="/home"
                    className="mt-5 inline-block rounded-xl bg-[#198754] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#157347]"
                  >
                    Find Other Food
                  </Link>
                </div>
              ) : isClaimed ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 text-xl">
                    🤝
                  </div>

                  <h4 className="mt-4 font-semibold text-gray-700">
                    This food has already been claimed
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Someone else has already claimed this
                    food.
                  </p>

                  <Link
                    href="/home"
                    className="mt-5 inline-block rounded-xl bg-[#198754] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#157347]"
                  >
                    Find Other Food
                  </Link>
                </div>
              ) : canClaim ? (
                <div>
                  {/* Confirmation message */}

                  <div className="rounded-2xl bg-[#eaf5ec] p-5">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                        ✓
                      </div>

                      <div>
                        <p className="font-semibold text-[#151b17]">
                          Ready to claim?
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          By continuing, you'll claim this
                          food for yourself. Please make sure
                          you can collect it from the location
                          before the availability time.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Claim button */}

                  <div className="mt-5">
                    <ClaimFoodButton
                      foodId={food.id}
                    />
                  </div>

                  <Link
                    href={`/food/${food.id}`}
                    className="mt-3 block text-center text-sm font-semibold text-gray-500 transition hover:text-[#198754]"
                  >
                    ← Go back
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}