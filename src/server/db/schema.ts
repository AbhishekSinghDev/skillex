import { relations } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 as v7uuid } from "uuid";

export const user = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7uuid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  courses: many(course),
}));

export const session = pgTable("session", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7uuid()),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7uuid()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7uuid()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const statusEnum = pgEnum("status_enum", [
  "draft",
  "published",
  "archived",
]);

export const courseLevelEnum = pgEnum("course_level_enum", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const courseCategoryEnum = pgEnum("course_category_enum", [
  "programming",
  "web-development",
  "mobile-development",
  "data-science",
  "machine-learning",
  "artificial-intelligence",
  "design",
  "ui-ux-design",
  "digital-marketing",
  "business",
  "photography",
  "music",
  "language-learning",
  "personal-development",
  "health-fitness",
  "finance",
  "others",
]);

export const course = pgTable("course", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7uuid()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  smallDescription: text("small_description").notNull(),
  category: courseCategoryEnum("category").notNull(),
  fileKey: text("file_key").notNull(),
  price: numeric("price").notNull(),
  duration: numeric("duration").notNull(),
  level: courseLevelEnum("level").notNull(),
  status: statusEnum("status").default("draft").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const courseRelations = relations(course, ({ one }) => ({
  user: one(user, {
    fields: [course.userId],
    references: [user.id],
  }),
}));
