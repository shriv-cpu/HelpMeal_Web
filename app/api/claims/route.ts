import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/lib/db";
import { claims, foodPosts, users } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Read request body
    const body = await request.json();
    const foodId = Number(body.foodId);

    if (!Number.isInteger(foodId)) {
      return NextResponse.json(
        { error: "Invalid food post" },
        { status: 400 }
      );
    }

    // Find our user in the database
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

    // Find the food post
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

    // Prevent owner from claiming their own food
    if (food.userId === user.id) {
      return NextResponse.json(
        { error: "You cannot claim your own food post" },
        { status: 400 }
      );
    }

    // Check current status
    if (food.status !== "available") {
      return NextResponse.json(
        { error: "This food is no longer available" },
        { status: 409 }
      );
    }

    // Check expiration
    if (new Date(food.availableUntil) <= new Date()) {
      return NextResponse.json(
        { error: "This food is no longer available" },
        { status: 400 }
      );
    }

    /*
     * The important part:
     *
     * We first change the food from "available" to "claimed".
     *
     * BUT we only allow the update when:
     *
     * 1. The food ID matches
     * 2. The food is STILL available
     * 3. The food has NOT expired
     *
     * This prevents two users from claiming the same food.
     */
    const result = await db.transaction(async (tx) => {
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
       * If no row was updated, somebody else claimed it
       * between our first check and this database operation.
       */
      if (!updatedFood) {
        return {
          success: false,
          error: "This food is no longer available",
        };
      }

      // Create the claim only after successfully claiming the food
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
        success: true,
        claim,
      };
    });

    // Another user claimed it first
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "Food claimed successfully",
        claim: result.claim,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to claim food:", error);

    return NextResponse.json(
      { error: "Failed to claim food" },
      { status: 500 }
    );
  }
}