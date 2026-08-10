import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { claims, foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const user = await getOrCreateUser();

  if (!user) {
    redirect("/login");
  }

  const [postsResult] = await db
    .select({
      count: count(),
    })
    .from(foodPosts)
    .where(eq(foodPosts.userId, user.id));

  const [claimsResult] = await db
    .select({
      count: count(),
    })
    .from(claims)
    .where(eq(claims.userId, user.id));

  const postCount = Number(postsResult?.count ?? 0);
  const claimCount = Number(claimsResult?.count ?? 0);

  const memberSince = new Date(
    user.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link
            href="/home"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#198754] text-xl text-white">
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

      {/* Profile */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#198754]">
            Account
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[#151b17]">
            Your Profile
          </h2>

          <p className="mt-3 text-gray-600">
            Manage your HelpMeal account and activity.
          </p>
        </div>

        {/* User Information */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-[#eaf5ec] px-6 py-8 md:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#198754] text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#151b17]">
                  {user.name}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Member Since
              </p>

              <p className="mt-2 font-semibold text-[#151b17]">
                {memberSince}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email
              </p>

              <p className="mt-2 break-all font-semibold text-[#151b17]">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* My Posts */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf5ec] text-2xl">
              🍱
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Food Posts
            </p>

            <p className="mt-1 text-3xl font-bold text-[#151b17]">
              {postCount}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Food items you have shared.
            </p>

            <Link
              href="/my-posts"
              className="mt-5 inline-block text-sm font-semibold text-[#198754] hover:underline"
            >
              View My Posts →
            </Link>
          </div>

          {/* My Claims */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf5ec] text-2xl">
              🤝
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Food Claims
            </p>

            <p className="mt-1 text-3xl font-bold text-[#151b17]">
              {claimCount}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Food items you have claimed.
            </p>

            <Link
              href="/my-claims"
              className="mt-5 inline-block text-sm font-semibold text-[#198754] hover:underline"
            >
              View My Claims →
            </Link>
          </div>
        </div>

        {/* Account */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#151b17]">
            Account
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your HelpMeal session.
          </p>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <LogoutButton />
          </div>
        </div>
      </section>
    </main>
  );
}