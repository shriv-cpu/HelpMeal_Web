import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

export default async function HomePage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return null;
  }

  const user = await getOrCreateUser();

  if (!user) {
    return null;
  }

  const posts = await db
    .select()
    .from(foodPosts)
    .where(eq(foodPosts.status, "available"))
    .orderBy(desc(foodPosts.createdAt));

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

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

          <div className="flex items-center gap-5">
            <Link
              href="/post-food"
              className="hidden rounded-xl bg-[#198754] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#157347] sm:block"
            >
              + Post Food
            </Link>

            <Link
              href="/profile"
              className="hidden text-sm font-medium text-gray-600 hover:text-[#198754] sm:block"
            >
              Profile
            </Link>

            <UserButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="rounded-3xl bg-[#eaf5ec] px-8 py-10 md:px-12">

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#198754]">
            Welcome back, {user.name}
          </p>

          <h2 className="max-w-2xl text-4xl font-bold leading-tight text-[#151b17] md:text-5xl">
            Good food should
            <span className="text-[#198754]"> never go to waste.</span>
          </h2>

          <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
            Find extra food shared by people around you and help make sure
            good food reaches someone who needs it.
          </p>

          {/* Search */}
          <div className="mt-7 flex max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Search for food..."
              className="w-full px-5 py-4 text-sm outline-none"
            />

            <button
              type="button"
              className="bg-[#198754] px-7 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["All Food", "Meals", "Rice", "Snacks", "Fruits", "Other"].map(
            (category) => (
              <button
                key={category}
                type="button"
                className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium ${
                  category === "All Food"
                    ? "border-[#198754] bg-[#198754] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#198754] hover:text-[#198754]"
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>
      </section>

      {/* Food */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#151b17]">
              Food available near you
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Freshly shared food from the HelpMeal community
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf5ec] text-3xl">
              🍱
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#151b17]">
              No food posted yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Be the first person to share extra food with someone in your
              community.
            </p>

            <Link
              href="/post-food"
              className="mt-6 inline-block rounded-xl bg-[#198754] px-6 py-3 text-sm font-semibold text-white hover:bg-[#157347]"
            >
              Post Your Food
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((food) => (
              <Link
                href={`/food/${food.id}`}
                key={food.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-52 bg-gray-100">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🍱
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-[#151b17]">
                      {food.title}
                    </h3>

                    <span className="rounded-full bg-[#eaf5ec] px-2.5 py-1 text-xs font-medium text-[#198754]">
                      Available
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    Quantity: {food.quantity}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    📍 {food.location}
                  </p>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-[#198754]">
                      View Food →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Mobile Post Button */}
      <Link
        href="/post-food"
        className="fixed bottom-6 right-6 flex h-14 items-center gap-2 rounded-full bg-[#198754] px-6 text-sm font-semibold text-white shadow-lg sm:hidden"
      >
        + Post Food
      </Link>
    </main>
  );
}