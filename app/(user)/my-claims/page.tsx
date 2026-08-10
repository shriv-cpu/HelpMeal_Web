import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { claims, foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

export default async function MyClaimsPage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const user = await getOrCreateUser();

  if (!user) {
    redirect("/login");
  }

  const myClaims = await db
    .select({
      claimId: claims.id,
      claimedAt: claims.createdAt,

      foodId: foodPosts.id,
      title: foodPosts.title,
      description: foodPosts.description,
      image: foodPosts.image,
      foodType: foodPosts.foodType,
      quantity: foodPosts.quantity,
      location: foodPosts.location,
      availableUntil: foodPosts.availableUntil,
      status: foodPosts.status,
    })
    .from(claims)
    .innerJoin(
      foodPosts,
      eq(claims.foodPostId, foodPosts.id)
    )
    .where(eq(claims.userId, user.id))
    .orderBy(desc(claims.createdAt));

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
            href="/home"
            className="text-sm font-medium text-gray-600 transition hover:text-[#198754]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#198754]">
              Your activity
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight text-[#151b17]">
              My Claims
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Food you have claimed from the HelpMeal
              community.
            </p>
          </div>

          <Link
            href="/home"
            className="w-fit rounded-xl bg-[#198754] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#157347]"
          >
            Browse Food
          </Link>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {myClaims.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf5ec] text-3xl">
              🤝
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#151b17]">
              No food claimed yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Find food shared by people in your community
              and claim something that you need.
            </p>

            <Link
              href="/home"
              className="mt-6 inline-block rounded-xl bg-[#198754] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#157347]"
            >
              Find Food
            </Link>
          </div>
        ) : (
          <>
            {/* =================================================
                CLAIM COUNT
            ================================================= */}

            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {myClaims.length}{" "}
                {myClaims.length === 1
                  ? "food claimed"
                  : "foods claimed"}
              </p>
            </div>

            {/* =================================================
                CLAIM CARDS
            ================================================= */}

            <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myClaims.map((claim) => {
                const isAvailable =
                  claim.status === "available" &&
                  new Date(claim.availableUntil) >
                    new Date();

                const isExpired =
                  new Date(claim.availableUntil) <=
                  new Date();

                const claimedDate =
                  claim.claimedAt
                    ? new Date(
                        claim.claimedAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                const availableUntil =
                  new Date(
                    claim.availableUntil
                  ).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  });

                return (
                  <article
                    key={claim.claimId}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#198754]/30 hover:shadow-lg"
                  >
                    {/* Image */}

                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      {claim.image ? (
                        <img
                          src={claim.image}
                          alt={claim.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eaf5ec] to-[#f5f8f5] text-6xl">
                          🍱
                        </div>
                      )}

                      {/* Status */}

                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-sm ${
                            isAvailable
                              ? "text-[#198754]"
                              : "text-gray-500"
                          }`}
                        >
                          {isAvailable
                            ? "Claimed"
                            : isExpired
                              ? "Expired"
                              : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-lg font-bold text-[#151b17]">
                          {claim.title}
                        </h3>

                        <span className="shrink-0 rounded-full bg-[#eaf5ec] px-2.5 py-1 text-xs font-medium text-[#198754]">
                          {claim.foodType}
                        </span>
                      </div>

                      {/* Details */}

                      <div className="mt-4 space-y-2.5">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-700">
                            Quantity:
                          </span>{" "}
                          {claim.quantity}
                        </p>

                        <p className="line-clamp-1 text-sm text-gray-500">
                          📍 {claim.location}
                        </p>

                        <p className="text-sm text-gray-500">
                          ⏰ Until {availableUntil}
                        </p>
                      </div>

                      {/* Claim date */}

                      <div className="mt-4 rounded-xl bg-[#f8faf8] px-4 py-3">
                        <p className="text-xs text-gray-400">
                          Claimed on
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {claimedDate}
                        </p>
                      </div>

                      {/* Actions */}

                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <Link
                          href={`/food/${claim.foodId}`}
                          className="block w-full rounded-xl bg-[#198754] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#157347]"
                        >
                          View Food
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}