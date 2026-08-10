import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";
import { foodPosts } from "@/lib/schema";
import { getOrCreateUser } from "@/lib/user";

import EditFoodForm from "@/components/EditFoodForm";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const { userId: clerkId } = await auth();

  /*
   * User must be logged in.
   */
  if (!clerkId) {
    redirect("/login");
  }

  const { id } = await params;

  const foodId = Number(id);

  /*
   * Invalid URL.
   *
   * Example:
   * /edit-post/abc
   */
  if (!Number.isInteger(foodId) || foodId <= 0) {
    notFound();
  }

  /*
   * Find the current database user.
   */
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/login");
  }

  /*
   * Find the food post.
   */
  const [food] = await db
    .select()
    .from(foodPosts)
    .where(eq(foodPosts.id, foodId))
    .limit(1);

  /*
   * Food does not exist.
   */
  if (!food) {
    notFound();
  }

  /*
   * SECURITY CHECK
   *
   * The food post must belong to the
   * currently logged-in user.
   */
  if (food.userId !== user.id) {
    redirect("/my-posts");
  }

  /*
   * Claimed food should not be edited.
   */
  if (food.status !== "available") {
    redirect(`/food/${food.id}`);
  }

  /*
   * Expired food should not be edited.
   */
  if (
    new Date(food.availableUntil) <= new Date()
  ) {
    redirect(`/food/${food.id}`);
  }

  return (
    <main className="min-h-screen bg-[#f8faf8]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[76px] max-w-5xl items-center justify-between px-5 sm:px-8">
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

              <p className="text-[11px] font-medium tracking-wide text-gray-500">
                FOOD • SHARE • HELP
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

      {/* Main */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#198754]">
            Your Food Post
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#151b17] sm:text-4xl">
            Edit Food Post
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Update the details of your shared food.
            Make sure the information is accurate so
            people know what is available.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Form */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <EditFoodForm food={food} />
          </div>

          {/* Side Information */}
          <aside className="space-y-5">
            <div className="rounded-[24px] bg-[#eaf5ec] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                🍱
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#151b17]">
                Sharing food matters
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Keep your food details accurate so
                someone nearby can quickly understand
                what you are offering.
              </p>
            </div>

            <div className="rounded-[24px] border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-[#151b17]">
                Before you save
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex gap-3 text-sm text-gray-600">
                  <span className="text-[#198754]">
                    ✓
                  </span>
                  Check the quantity
                </div>

                <div className="flex gap-3 text-sm text-gray-600">
                  <span className="text-[#198754]">
                    ✓
                  </span>
                  Confirm the location
                </div>

                <div className="flex gap-3 text-sm text-gray-600">
                  <span className="text-[#198754]">
                    ✓
                  </span>
                  Set a future availability time
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}