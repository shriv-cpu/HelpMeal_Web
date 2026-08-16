import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { notifications, users } from "@/lib/schema";

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

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt));

    return NextResponse.json({
      notifications: userNotifications,
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}