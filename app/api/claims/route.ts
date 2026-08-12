import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { claims, foodPosts, users } from "@/lib/schema";

const claimSchema = z.object({
  foodId: z.coerce
    .number()
    .int()
    .positive(),
});

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // 2. Read and validate request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const result = claimSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid food post ID",
        },
        { status: 400 }
      );
    }

    const { foodId } = result.data;

    // 3. Find logged-in database user
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

    // 4. Find food post
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

    // 5. Prevent owner from claiming own food
    if (food.userId === user.id) {
      return NextResponse.json(
        {
          error: "You cannot claim your own food post",
        },
        { status: 400 }
      );
    }

    // 6. Check current status
    if (food.status !== "available") {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 409 }
      );
    }

    // 7. Check expiration
    const now = new Date();

    if (new Date(food.availableUntil) <= now) {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 400 }
      );
    }

    /*
     * 8. Atomic claim operation
     *
     * The food is changed from:
     *
     * available → claimed
     *
     * only if it is STILL available and
     * has not expired.
     *
     * This prevents two users from
     * successfully claiming the same food.
     */
    const transactionResult = await db.transaction(
      async (tx) => {
        const [updatedFood] = await tx
          .update(foodPosts)
          .set({
            status: "claimed",
          })
          .where(
            and(
              eq(foodPosts.id, foodId),
              eq(foodPosts.status, "available"),
              gt(foodPosts.availableUntil, new Date())
            )
          )
          .returning({
            id: foodPosts.id,
          });

        /*
         * No row updated means another request
         * already claimed the food or it expired.
         */
        if (!updatedFood) {
          return {
            success: false as const,
            error: "This food is no longer available",
          };
        }

        // Create claim after successfully claiming food
        const [claim] = await tx
          .insert(claims)
          .values({
            foodPostId: foodId,
            userId: user.id,
          })
          .returning();

        if (!claim) {
          throw new Error("Failed to create claim");
        }

        return {
          success: true as const,
          claim,
        };
      }
    );

    // Another request claimed the food first
    if (!transactionResult.success) {
      return NextResponse.json(
        {
          error: transactionResult.error,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "Food claimed successfully",
        claim: transactionResult.claim,
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