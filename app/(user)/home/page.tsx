import NotificationButton from "@/components/NotificationButton";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  and,
  desc,
  eq,
  gt,
  ilike,
  or,
} from "drizzle-orm";

import { db } from "@/lib/db";
import { foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

type HomePageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

const categories = [
  {
    label: "All Food",
    value: "all",
  },
  {
    label: "Meals",
    value: "Meal",
  },
  {
    label: "Rice",
    value: "Rice",
  },
  {
    label: "Snacks",
    value: "Snacks",
  },
  {
    label: "Fruits",
    value: "Fruits",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export default async function HomePage({
  searchParams,
}: HomePageProps) {
  const user = await getOrCreateUser();

  if (!user) {
    return null;
  }

  const params = await searchParams;

  const search = params.search?.trim() || "";

  const category =
    params.category?.trim() || "all";

  const validCategory = categories.some(
    (item) => item.value === category
  )
    ? category
    : "all";

  /*
   * Current time.
   *
   * We use this when querying the database so expired
   * food is not shown as available.
   */
  const now = new Date();

  /*
   * Base conditions:
   *
   * 1. Food must have available status.
   * 2. Food must not be expired.
   */
  const conditions = [
    eq(foodPosts.status, "available"),
    gt(foodPosts.availableUntil, now),
  ];

  /*
   * Search filter.
   *
   * Searches:
   * - title
   * - description
   * - food type
   * - location
   */
  if (search) {
    conditions.push(
      or(
        ilike(foodPosts.title, `%${search}%`),
        ilike(
          foodPosts.description,
          `%${search}%`
        ),
        ilike(
          foodPosts.foodType,
          `%${search}%`
        ),
        ilike(
          foodPosts.location,
          `%${search}%`
        )
      )!
    );
  }

  /*
   * Category filter.
   */
  if (validCategory !== "all") {
    conditions.push(
      eq(foodPosts.foodType, validCategory)
    );
  }

  /*
   * Get only currently available food.
   */
  const posts = await db
    .select()
    .from(foodPosts)
    .where(and(...conditions))
    .orderBy(desc(foodPosts.createdAt));

  const selectedCategory =
    categories.find(
      (item) => item.value === validCategory
    )?.label || "All Food";

  /*
   * Keep search active when changing category.
   */
  function getCategoryUrl(
    categoryValue: string
  ) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (categoryValue !== "all") {
      query.set("category", categoryValue);
    }

    const queryString = query.toString();

    return queryString
      ? `/home?${queryString}`
      : "/home";
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#151b17]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/home"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#198754] text-xl text-white">
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

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/post-food"
              className="hidden rounded-xl bg-[#198754] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#157347] sm:block"
            >
              + Post Food
            </Link>

            <Link
              href="/profile"
              className="hidden text-sm font-medium text-gray-600 transition hover:text-[#198754] sm:block"
            >
              Profile
            </Link>
              <NotificationButton />
            <UserButton />
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-8 sm:pt-10">
        <div className="relative overflow-hidden rounded-[32px] bg-[#eaf5ec] px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#d8ecdd]" />

          <div className="pointer-events-none absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-[#dff0e2]" />

          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#198754]">
              Welcome back, {user.name}
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Good food should
              <span className="text-[#198754]">
                {" "}
                never go to waste.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Find extra food shared by people around you
              and help make sure good food reaches someone
              who needs it.
            </p>

            {/* Search */}

            <form
              action="/home"
              method="GET"
              className="mt-8 flex max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-[#198754]/20"
            >
              {validCategory !== "all" && (
                <input
                  type="hidden"
                  name="category"
                  value={validCategory}
                />
              )}

              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search food, location, or food type..."
                className="min-w-0 flex-1 px-5 py-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="bg-[#198754] px-7 text-sm font-semibold text-white transition hover:bg-[#157347]"
              >
                Search
              </button>
            </form>

            {/* Active filters */}

            {(search || validCategory !== "all") && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-medium text-gray-600">
                  Active filters:
                </span>

                {search && (
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                    Search: {search}
                  </span>
                )}

                {validCategory !== "all" && (
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                    Category: {selectedCategory}
                  </span>
                )}

                <Link
                  href="/home"
                  className="font-semibold text-[#198754] hover:underline"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((item) => {
            const isActive =
              validCategory === item.value;

            return (
              <Link
                key={item.value}
                href={getCategoryUrl(item.value)}
                className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "border-[#198754] bg-[#198754] text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#198754] hover:text-[#198754]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FOOD
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#198754]">
              Community food
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {search || validCategory !== "all"
                ? `${
                    selectedCategory === "All Food"
                      ? "Food"
                      : selectedCategory
                  } ${
                    search
                      ? `matching "${search}"`
                      : "available"
                  }`
                : "Food available near you"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {search || validCategory !== "all"
                ? "Currently available food matching your filters."
                : "Freshly shared food from the HelpMeal community."}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {posts.length}{" "}
            {posts.length === 1 ? "post" : "posts"}
          </div>
        </div>

        {/* =================================================
            NO RESULTS
        ================================================= */}

        {posts.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf5ec] text-3xl">
              🔎
            </div>

            <h3 className="mt-5 text-xl font-bold">
              No food available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {search
                ? `We couldn't find any currently available food matching "${search}"${
                    validCategory !== "all"
                      ? ` in ${selectedCategory}`
                      : ""
                  }.`
                : `There are currently no available ${selectedCategory.toLowerCase()} posts.`}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/home"
                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#198754] hover:text-[#198754]"
              >
                Clear Filters
              </Link>

              <Link
                href="/post-food"
                className="rounded-xl bg-[#198754] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#157347]"
              >
                Post Your Food
              </Link>
            </div>
          </div>
        ) : (
          /* =================================================
             FOOD CARDS
          ================================================= */

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((food) => (
              <Link
                href={`/food/${food.id}`}
                key={food.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#198754]/30 hover:shadow-xl"
              >
                {/* Image */}

                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eaf5ec] to-[#f5f8f5] text-6xl">
                      🍱
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#198754] shadow-sm backdrop-blur">
                    Available
                  </div>
                </div>

                {/* Content */}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-lg font-bold text-[#151b17]">
                      {food.title}
                    </h3>

                    <span className="shrink-0 rounded-full bg-[#eaf5ec] px-2.5 py-1 text-xs font-medium text-[#198754]">
                      {food.foodType}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        Quantity:
                      </span>{" "}
                      {food.quantity}
                    </p>

                    <p className="line-clamp-1 text-sm text-gray-500">
                      📍 {food.location}
                    </p>

                    <p className="text-xs text-gray-400">
                      Available until{" "}
                      {new Date(
                        food.availableUntil
                      ).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-[#198754]">
                      View Food
                    </span>

                    <span className="text-lg text-[#198754] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          MOBILE POST BUTTON
      ===================================================== */}

      <Link
        href="/post-food"
        className="fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-[#198754] px-6 text-sm font-semibold text-white shadow-xl shadow-[#198754]/20 transition hover:bg-[#157347] sm:hidden"
      >
        + Post Food
      </Link>
    </main>
  );
}