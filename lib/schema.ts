import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
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

  createdAt: timestamp("created_at").defaultNow().notNull(),
});