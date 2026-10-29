import { pgTable, index, serial, text, numeric, timestamp, foreignKey, check, integer, date, unique, varchar, json, real } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id"),
	firstName: text("first_name").notNull(),
	surname: text().notNull(),
	firstLineAddress: text("first_line_address").notNull(),
	secondLineAddress: text("second_line_address"),
	city: text().notNull(),
	county: text().notNull(),
	postcode: text().notNull(),
	country: text().notNull(),
	email: text().notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_orders_user_created").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("text_ops")),
]);

export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	productId: text("product_id").notNull(),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	date: date(),
	hour: text(),
}, (table) => [
	index("idx_order_items_order").using("btree", table.orderId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_product_id_fkey"
		}),
	check("order_items_quantity_check", sql`quantity > 0`),
]);

export const products = pgTable("products", {
	id: text().primaryKey().notNull(),
	category: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	features: text().array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_products_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	check("products_price_check", sql`price >= (0)::numeric`),
	check("products_category_check", sql`category = ANY (ARRAY['facility'::text, 'service'::text, 'membership'::text])`),
]);

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const userSessions = pgTable("user_sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: json().notNull(),
	expire: timestamp({ precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const playingWithNeon = pgTable("playing_with_neon", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	value: real(),
});
