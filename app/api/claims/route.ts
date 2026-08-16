import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import {
  claims,
  foodPosts,
  notifications,
  users,
} from "@/lib/schema";

const claimSchema = z.object({
  foodId: z.coerce.number().int().positive(),
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

    // 3. Validate food ID
    const parsed = claimSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid food post ID" },
        { status: 400 }
      );
    }

    const { foodId } = parsed.data;

    // 4. Find logged-in user
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

    // 5. Find food
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

    // 6. Owner cannot request their own food
    if (food.userId === user.id) {
      return NextResponse.json(
        {
          error: "You cannot request your own food",
        },
        { status: 400 }
      );
    }

    // 7. Food must still be available
    if (food.status !== "available") {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 409 }
      );
    }

    // 8. Check expiry
    if (new Date(food.availableUntil) <= new Date()) {
      return NextResponse.json(
        {
          error: "This food is no longer available",
        },
        { status: 400 }
      );
    }

    // 9. Prevent duplicate pending/approved request
    const [existingClaim] = await db
      .select()
      .from(claims)
      .where(
        and(
          eq(claims.foodPostId, foodId),
          eq(claims.userId, user.id)
        )
      )
      .limit(1);

    if (existingClaim) {
      if (existingClaim.status === "pending") {
        return NextResponse.json(
          {
            error: "You already have a pending request for this food",
          },
          { status: 409 }
        );
      }

      if (existingClaim.status === "approved") {
        return NextResponse.json(
          {
            error: "You have already been approved for this food",
          },
          { status: 409 }
        );
      }

      // If previous request was denied, allow a new request
      if (existingClaim.status === "denied") {
        const [newClaim] = await db
          .insert(claims)
          .values({
            foodPostId: foodId,
            userId: user.id,
            status: "pending",
          })
          .returning();

        if (!newClaim) {
          throw new Error("Failed to create claim request");
        }

        await db.insert(notifications).values({
          userId: food.userId,
          claimId: newClaim.id,
          type: "claim_request",
          title: "New Food Request",
          message: `${user.name} wants to claim your food: ${food.title}`,
        });

        return NextResponse.json(
          {
            message: "Food request sent successfully",
            claim: newClaim,
          },
          { status: 201 }
        );
      }
    }

    // 10. Create pending claim
    const [claim] = await db
      .insert(claims)
      .values({
        foodPostId: foodId,
        userId: user.id,
        status: "pending",
      })
      .returning();

    if (!claim) {
      throw new Error("Failed to create claim request");
    }

    // 11. Notify food owner
    await db.insert(notifications).values({
      userId: food.userId,
      claimId: claim.id,
      type: "claim_request",
      title: "New Food Request",
      message: `${user.name} wants to claim your food: ${food.title}`,
    });

    // 12. Return pending request
    return NextResponse.json(
      {
        message: "Food request sent successfully",
        claim,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create food request:", error);

    return NextResponse.json(
      {
        error: "Failed to create food request",
      },
      { status: 500 }
    );
  }
}