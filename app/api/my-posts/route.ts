import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { foodPosts, users } from "@/lib/schema";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const [user] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    const posts = await db
      .select()
      .from(foodPosts)
      .where(eq(foodPosts.userId, user.id))
      .orderBy(desc(foodPosts.createdAt));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch user's food posts:", error);

    return NextResponse.json(
      { error: "Failed to fetch food posts" },
      { status: 500 }
    );
  }
}