import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { claims, foodPosts, users } from "@/lib/schema";

const claimSchema = z.object({
  foodId: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    // Authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Read request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    // Validate request
    const parsed = claimSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid food post ID" },
        { status: 400 }
      );
    }

    const { foodId } = parsed.data;

    // Find logged-in database user
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

    // Find food post
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

    // Owner cannot claim own food
    if (food.userId === user.id) {
      return NextResponse.json(
        {
          error: "You cannot claim your own food post",
        },
        { status: 400 }
      );
    }

    // Check availability
    if (food.status !== "available") {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 409 }
      );
    }

    // Check expiry
    if (new Date(food.availableUntil) <= new Date()) {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 400 }
      );
    }

    /*
     * Neon HTTP does not support db.transaction()
     *
     * Therefore we use ONE PostgreSQL statement.
     *
     * The food is changed from available → claimed
     * and the claim is inserted in the same database
     * statement.
     *
     * This keeps the operation atomic.
     */
    const result = await db.execute(sql`
      WITH claimed_food AS (
        UPDATE ${foodPosts}
        SET ${foodPosts.status} = 'claimed'
        WHERE
          ${foodPosts.id} = ${foodId}
          AND ${foodPosts.status} = 'available'
          AND ${foodPosts.availableUntil} > NOW()
        RETURNING ${foodPosts.id}
      )
      INSERT INTO ${claims}
        (${claims.foodPostId}, ${claims.userId})
      SELECT
        ${foodId},
        ${user.id}
      FROM claimed_food
      RETURNING *
    `);

    // No row inserted means another request claimed it first
    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 409 }
      );
    }

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