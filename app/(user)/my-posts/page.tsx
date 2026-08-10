import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import DeleteFoodButton from "@/components/DeleteFoodButton";

import { db } from "@/lib/db";
import { foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

export default async function MyPostsPage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const user = await getOrCreateUser();

  if (!user) {
    redirect("/login");
  }

  const posts = await db
    .select()
    .from(foodPosts)
    .where(eq(foodPosts.userId, user.id))
    .orderBy(desc(foodPosts.createdAt));

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/home" className="flex items-center gap-3">
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
            className="text-sm font-medium text-gray-600 hover:text-[#198754]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#198754]">
              Your activity
            </p>

            <h2 className="mt-2 text-4xl font-bold text-[#151b17]">
              My Food Posts
            </h2>

            <p className="mt-3 text-gray-600">
              Manage the food you have shared with the community.
            </p>
          </div>

          <Link
            href="/post-food"
            className="rounded-xl bg-[#198754] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#157347]"
          >
            + Post Food
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf5ec] text-3xl">
              🍱
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#151b17]">
              You haven't shared any food yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Have extra food? Share it with someone who can use it.
            </p>

            <Link
              href="/post-food"
              className="mt-6 inline-block rounded-xl bg-[#198754] px-6 py-3 text-sm font-semibold text-white hover:bg-[#157347]"
            >
              Share Food
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const availableUntil = new Date(
                post.availableUntil
              ).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              });

              const isAvailable = post.status === "available";

              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="h-48 bg-gray-100">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        🍱
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#151b17]">
                        {post.title}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isAvailable
                            ? "bg-[#eaf5ec] text-[#198754]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isAvailable ? "Available" : "Claimed"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      {post.quantity}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      📍 {post.location}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      ⏰ Until {availableUntil}
                    </p>

                    {/* View + Edit */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                      <Link
                        href={`/food/${post.id}`}
                        className="rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700 hover:border-[#198754] hover:text-[#198754]"
                      >
                        View
                      </Link>

                      {isAvailable ? (
                        <Link
                          href={`/edit-post/${post.id}`}
                          className="rounded-xl bg-[#198754] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#157347]"
                        >
                          Edit
                        </Link>
                      ) : (
                        <span className="rounded-xl bg-gray-100 py-2.5 text-center text-sm font-semibold text-gray-400">
                          Edit unavailable
                        </span>
                      )}
                    </div>

                    {/* Delete */}
                    {isAvailable && (
                      <div className="mt-3">
                        <DeleteFoodButton foodId={post.id} />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}