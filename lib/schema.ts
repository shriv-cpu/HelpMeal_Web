import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const foodPosts = pgTable("food_posts", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  foodType: text("food_type").notNull(),
  quantity: text("quantity").notNull(),
  location: text("location").notNull(),
  availableUntil: timestamp("available_until").notNull(),

  // available | claimed
  status: text("status").default("available").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),

  foodPostId: integer("food_post_id")
    .notNull()
    .references(() => foodPosts.id),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  // pending | approved | denied
  status: text("status").default("pending").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  respondedAt: timestamp("responded_at"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),

  // Person receiving the notification
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  // Related claim
  claimId: integer("claim_id")
    .references(() => claims.id),

  type: text("type").notNull(),

  title: text("title").notNull(),

  message: text("message").notNull(),

  read: boolean("read").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});