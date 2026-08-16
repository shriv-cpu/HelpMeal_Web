import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { claims, foodPosts, users } from "@/lib/schema";

const claimSchema = z.object({
  foodId: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // 2. Read request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    // 3. Validate request
    const parsed = claimSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid food post ID" },
        { status: 400 }
      );
    }

    const { foodId } = parsed.data;

    // 4. Find logged-in database user
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

    // 5. Find food post
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

    // 6. Prevent owner from claiming their own food
    if (food.userId === user.id) {
      return NextResponse.json(
        {
          error: "You cannot claim your own food post",
        },
        { status: 400 }
      );
    }

    // 7. Check food status
    if (food.status !== "available") {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 409 }
      );
    }

    // 8. Check expiration
    if (new Date(food.availableUntil) <= new Date()) {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 400 }
      );
    }

    /*
     * 9. Atomically claim the food.
     *
     * We cannot use db.transaction() because the
     * production Neon HTTP driver does not support it.
     *
     * This single SQL statement:
     *
     * available → claimed
     * and
     * creates the claim
     *
     * only when the food is still available.
     */
    const result = await db.execute(sql`
      WITH claimed_food AS (
        UPDATE ${foodPosts}
        SET status = 'claimed'
        WHERE
          id = ${foodId}
          AND status = 'available'
          AND available_until > NOW()
        RETURNING id
      )
      INSERT INTO ${claims}
        (food_post_id, user_id)
      SELECT
        ${foodId},
        ${user.id}
      FROM claimed_food
      RETURNING *
    `);

    /*
     * If nothing was inserted, another request
     * already claimed the food or it expired.
     */
    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 409 }
      );
    }

    // 10. Success
    return NextResponse.json(
      {
        message: "Food claimed successfully",
        claim: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to claim food:", error);

    return NextResponse.json(
      {
        error: "Failed to claim food",
      },
      { status: 500 }
    );
  }
}