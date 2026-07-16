import {
  pgTable,
  serial,
  text,
  numeric,
  timestamp,
  boolean,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

// Customers / Debtors table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }),
  totalDue: numeric("total_due", { precision: 12, scale: 2 }).default("0"),
  totalPaid: numeric("total_paid", { precision: 12, scale: 2 }).default("0"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment records
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .references(() => customers.id)
    .notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  note: text("note"),
  paidAt: timestamp("paid_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional due entries (when new dues are added)
export const dueEntries = pgTable("due_entries", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .references(() => customers.id)
    .notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily income/expense records
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 10 }).notNull(), // 'income' | 'expense'
  category: varchar("category", { length: 100 }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invoices
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).unique().notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }),
  items: text("items").notNull(), // JSON string
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  paid: numeric("paid", { precision: 12, scale: 2 }).default("0"),
  due: numeric("due", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("pending"), // pending | paid | partial
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerName: text("reviewer_name").notNull(),
  reviewerPhone: varchar("reviewer_phone", { length: 20 }),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  service: varchar("service", { length: 100 }),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Online Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerAddress: text("customer_address"),
  service: varchar("service", { length: 100 }).notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").default(1),
  estimatedPrice: numeric("estimated_price", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 20 }).default("pending"), // pending | confirmed | processing | delivered | cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type DueEntry = typeof dueEntries.$inferSelect;
export type NewDueEntry = typeof dueEntries.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
