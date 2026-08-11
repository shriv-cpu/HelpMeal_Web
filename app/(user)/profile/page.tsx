import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { claims, foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

export default async function ProfilePage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const user = await getOrCreateUser();

  if (!user) {
    redirect("/login");
  }

  // Count food posts created by the user
  const [postCountResult] = await db
    .select({
      count: count(),
    })
    .from(foodPosts)
    .where(eq(foodPosts.userId, user.id));

  // Count food claims made by the user
  const [claimCountResult] = await db
    .select({
      count: count(),
    })
    .from(claims)
    .where(eq(claims.userId, user.id));

  const postCount = Number(
    postCountResult?.count ?? 0
  );

  const claimCount = Number(
    claimCountResult?.count ?? 0
  );

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-IN",
        {
          month: "long",
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#198754] text-xl text-white shadow-sm">
              ♥
            </div>

            <div>
              <h1 className="text-xl font-bold">
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
          PROFILE
      ===================================================== */}

      <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        {/* Heading */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#198754]">
            Account
          </p>

          <h2 className="mt-2 text-4xl font-bold tracking-tight">
            Your Profile
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Manage your HelpMeal activity and see your
            contribution to the community.
          </p>
        </div>

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Green header */}

          <div className="relative h-32 overflow-hidden bg-[#eaf5ec]">
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-[#d8ecdd]" />

            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#dff0e2]" />
          </div>

          {/* Profile information */}

          <div className="relative px-6 pb-7 sm:px-8">
            {/* Avatar */}

            <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#198754] text-3xl font-bold text-white shadow-md">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            {/* Name */}

            <div className="mt-5">
              <h3 className="text-2xl font-bold">
                {user.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                HelpMeal member
                {memberSince
                  ? ` since ${memberSince}`
                  : ""}
              </p>
            </div>

            {/* =================================================
                USER DETAILS
            ================================================= */}

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Name
                </p>

                <p className="mt-2 font-semibold text-[#151b17]">
                  {user.name}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <p className="mt-2 break-all font-semibold text-[#151b17]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            ACTIVITY STATS
        ===================================================== */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Posts */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Food Posts
                </p>

                <p className="mt-2 text-4xl font-bold text-[#151b17]">
                  {postCount}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Food you've shared
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5ec] text-2xl">
                🍱
              </div>
            </div>
          </div>

          {/* Claims */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Food Claims
                </p>

                <p className="mt-2 text-4xl font-bold text-[#151b17]">
                  {claimCount}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Food you've received
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5ec] text-2xl">
                🤝
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <h3 className="text-lg font-bold">
            Your Activity
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access your food activity.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/my-posts"
              className="group rounded-2xl border border-gray-200 p-5 transition hover:-translate-y-0.5 hover:border-[#198754]/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    My Food Posts
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage food you've shared.
                  </p>
                </div>

                <span className="text-xl text-[#198754] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>

            <Link
              href="/my-claims"
              className="group rounded-2xl border border-gray-200 p-5 transition hover:-translate-y-0.5 hover:border-[#198754]/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    My Claims
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    View food you've claimed.
                  </p>
                </div>

                <span className="text-xl text-[#198754] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* =====================================================
            POST FOOD CTA
        ===================================================== */}

        <div className="mt-6 rounded-3xl bg-[#198754] p-7 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold">
                Have extra food?
              </p>

              <p className="mt-1 max-w-lg text-sm leading-6 text-white/80">
                Share it with someone in your community
                instead of letting good food go to waste.
              </p>
            </div>

            <Link
              href="/post-food"
              className="w-fit rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#198754] transition hover:bg-gray-100"
            >
              + Post Food
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}