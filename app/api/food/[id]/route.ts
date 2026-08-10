import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { claims, foodPosts, users } from "@/lib/schema";

type FoodRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| GET /api/food/[id]
|--------------------------------------------------------------------------
| Get a single food post.
| This is public because users need to be able to view food before
| deciding whether to claim it.
|--------------------------------------------------------------------------
*/

export async function GET(
  request: Request,
  { params }: FoodRouteProps
) {
  try {
    const { id } = await params;

    const foodId = Number(id);

    if (!Number.isInteger(foodId) || foodId <= 0) {
      return NextResponse.json(
        { error: "Invalid food post ID" },
        { status: 400 }
      );
    }

    const [food] = await db
      .select()
      .from(foodPosts)
      .where(eq(foodPosts.id, foodId))
      .limit(1);

    if (!food) {
      return NextResponse.json(
        { error: "Food post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      food,
    });
  } catch (error) {
    console.error("Failed to fetch food post:", error);

    return NextResponse.json(
      { error: "Failed to fetch food post" },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PUT /api/food/[id]
|--------------------------------------------------------------------------
| Update a food post.
|
| SECURITY:
| Only the user who created the food post can update it.
|--------------------------------------------------------------------------
*/

export async function PUT(
  request: Request,
  { params }: FoodRouteProps
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const foodId = Number(id);

    if (!Number.isInteger(foodId) || foodId <= 0) {
      return NextResponse.json(
        { error: "Invalid food post ID" },
        { status: 400 }
      );
    }

    /*
     * Find the logged-in database user.
     */
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    /*
     * Find the food post.
     */
    const [food] = await db
      .select()
      .from(foodPosts)
      .where(eq(foodPosts.id, foodId))
      .limit(1);

    if (!food) {
      return NextResponse.json(
        { error: "Food post not found" },
        { status: 404 }
      );
    }

    /*
     * IMPORTANT:
     * Check ownership before allowing the update.
     */
    if (food.userId !== user.id) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to edit this food post",
        },
        { status: 403 }
      );
    }

    /*
     * Once somebody has claimed the food,
     * the original post should no longer be editable.
     */
    if (food.status !== "available") {
      return NextResponse.json(
        {
          error:
            "This food post can no longer be edited",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const image =
      typeof body.image === "string"
        ? body.image.trim()
        : "";

    const foodType =
      typeof body.foodType === "string"
        ? body.foodType.trim()
        : "";

    const quantity =
      typeof body.quantity === "string"
        ? body.quantity.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    const availableUntil =
      typeof body.availableUntil === "string"
        ? body.availableUntil
        : "";

    /*
     * Validate required fields.
     */
    if (
      !title ||
      !foodType ||
      !quantity ||
      !location ||
      !availableUntil
    ) {
      return NextResponse.json(
        {
          error:
            "Title, food type, quantity, location and availability time are required",
        },
        { status: 400 }
      );
    }

    const availableUntilDate =
      new Date(availableUntil);

    if (Number.isNaN(availableUntilDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid availability date",
        },
        { status: 400 }
      );
    }

    if (availableUntilDate <= new Date()) {
      return NextResponse.json(
        {
          error:
            "Food must be available until a future time",
        },
        { status: 400 }
      );
    }

    /*
     * Update only fields that the user is allowed to change.
     *
     * Notice that we DON'T allow:
     * - id
     * - userId
     * - status
     * - createdAt
     *
     * to be changed from the request.
     */
    const [updatedFood] = await db
      .update(foodPosts)
      .set({
        title,
        description: description || null,
        image: image || null,
        foodType,
        quantity,
        location,
        availableUntil: availableUntilDate,
      })
      .where(eq(foodPosts.id, foodId))
      .returning();

    return NextResponse.json({
      message: "Food post updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error("Failed to update food post:", error);

    return NextResponse.json(
      { error: "Failed to update food post" },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE /api/food/[id]
|--------------------------------------------------------------------------
| Delete a food post.
|
| SECURITY:
| Only the owner can delete the post.
|--------------------------------------------------------------------------
*/

export async function DELETE(
  request: Request,
  { params }: FoodRouteProps
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const foodId = Number(id);

    if (!Number.isInteger(foodId) || foodId <= 0) {
      return NextResponse.json(
        { error: "Invalid food post ID" },
        { status: 400 }
      );
    }

    /*
     * Find logged-in database user.
     */
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    /*
     * Find food post.
     */
    const [food] = await db
      .select()
      .from(foodPosts)
      .where(eq(foodPosts.id, foodId))
      .limit(1);

    if (!food) {
      return NextResponse.json(
        { error: "Food post not found" },
        { status: 404 }
      );
    }

    /*
     * IMPORTANT:
     * Only the owner can delete the food post.
     */
    if (food.userId !== user.id) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to delete this food post",
        },
        { status: 403 }
      );
    }

    /*
     * If the food has already been claimed,
     * don't allow the owner to delete it.
     *
     * This prevents deleting a food post while
     * another user has a claim connected to it.
     */
    const [existingClaim] = await db
      .select()
      .from(claims)
      .where(eq(claims.foodPostId, foodId))
      .limit(1);

    if (existingClaim) {
      return NextResponse.json(
        {
          error:
            "This food post has already been claimed and cannot be deleted",
        },
        { status: 400 }
      );
    }

    /*
     * Delete the food post.
     */
    await db
      .delete(foodPosts)
      .where(eq(foodPosts.id, foodId));

    return NextResponse.json({
      message: "Food post deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete food post:", error);

    return NextResponse.json(
      { error: "Failed to delete food post" },
      { status: 500 }
    );
  }
}