import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { foodPosts } from "@/lib/schema";
import { users } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      foodType,
      quantity,
      location,
      availableUntil,
      image,
    } = body;

    if (
      !title ||
      !foodType ||
      !quantity ||
      !location ||
      !availableUntil
    ) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const [post] = await db
      .insert(foodPosts)
      .values({
        userId: user[0].id,
        title,
        description: description || null,
        foodType,
        quantity,
        location,
        availableUntil: new Date(availableUntil),
        image: image || null,
      })
      .returning();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create food post error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}