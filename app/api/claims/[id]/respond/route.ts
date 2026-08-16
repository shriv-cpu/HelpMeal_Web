import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  claims,
  foodPosts,
  notifications,
  users,
} from "@/lib/schema";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteProps
) {
  try {
    // Authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Get owner
    const [owner] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!owner) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // Claim ID
    const { id } = await params;
    const claimId = Number(id);

    if (!Number.isInteger(claimId) || claimId <= 0) {
      return NextResponse.json(
        { error: "Invalid claim ID" },
        { status: 400 }
      );
    }

    // Read action
    const body = await request.json();

    const action = body.action;

    if (action !== "approve" && action !== "deny") {
      return NextResponse.json(
        { error: "Action must be approve or deny" },
        { status: 400 }
      );
    }

    // Find claim + food
    const [claim] = await db
      .select({
        claimId: claims.id,
        claimStatus: claims.status,
        requesterId: claims.userId,
        foodId: foodPosts.id,
        foodTitle: foodPosts.title,
        foodOwnerId: foodPosts.userId,
        foodStatus: foodPosts.status,
        availableUntil: foodPosts.availableUntil,
      })
      .from(claims)
      .innerJoin(
        foodPosts,
        eq(claims.foodPostId, foodPosts.id)
      )
      .where(eq(claims.id, claimId))
      .limit(1);

    if (!claim) {
      return NextResponse.json(
        { error: "Claim request not found" },
        { status: 404 }
      );
    }

    // Only food owner can respond
    if (claim.foodOwnerId !== owner.id) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to respond to this request",
        },
        { status: 403 }
      );
    }

    // Request must still be pending
    if (claim.claimStatus !== "pending") {
      return NextResponse.json(
        {
          error: "This request has already been processed",
        },
        { status: 409 }
      );
    }

    // APPROVE
    if (action === "approve") {
      // Food must still be available
      if (
        claim.foodStatus !== "available" ||
        new Date(claim.availableUntil) <= new Date()
      ) {
        await db
          .update(claims)
          .set({
            status: "denied",
            respondedAt: new Date(),
          })
          .where(eq(claims.id, claimId));

        await db.insert(notifications).values({
          userId: claim.requesterId,
          claimId: claimId,
          type: "claim_denied",
          title: "Food Request Denied",
          message: `Your request for "${claim.foodTitle}" could not be approved because the food is no longer available.`,
        });

        return NextResponse.json(
          {
            error: "This food is no longer available",
          },
          { status: 409 }
        );
      }

      // Approve claim
      await db
        .update(claims)
        .set({
          status: "approved",
          respondedAt: new Date(),
        })
        .where(
          and(
            eq(claims.id, claimId),
            eq(claims.status, "pending")
          )
        );

      // Food becomes claimed
      await db
        .update(foodPosts)
        .set({
          status: "claimed",
        })
        .where(
          and(
            eq(foodPosts.id, claim.foodId),
            eq(foodPosts.status, "available")
          )
        );

      // Notify requester
      await db.insert(notifications).values({
        userId: claim.requesterId,
        claimId: claimId,
        type: "claim_approved",
        title: "Food Request Approved",
        message: `Your request for "${claim.foodTitle}" was approved!`,
      });

      return NextResponse.json({
        message: "Food request approved",
      });
    }

    // DENY
    await db
      .update(claims)
      .set({
        status: "denied",
        respondedAt: new Date(),
      })
      .where(
        and(
          eq(claims.id, claimId),
          eq(claims.status, "pending")
        )
      );

    // Notify requester
    await db.insert(notifications).values({
      userId: claim.requesterId,
      claimId: claimId,
      type: "claim_denied",
      title: "Food Request Denied",
      message: `Your request for "${claim.foodTitle}" was declined.`,
    });

    return NextResponse.json({
      message: "Food request denied",
    });
  } catch (error) {
    console.error("Failed to respond to claim:", error);

    return NextResponse.json(
      { error: "Failed to respond to food request" },
      { status: 500 }
    );
  }
}