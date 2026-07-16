import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers, payments, dueEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);

    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId));

    if (!customer.length) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const paymentHistory = await db
      .select()
      .from(payments)
      .where(eq(payments.customerId, customerId))
      .orderBy(desc(payments.paidAt));

    const dueHistory = await db
      .select()
      .from(dueEntries)
      .where(eq(dueEntries.customerId, customerId))
      .orderBy(desc(dueEntries.createdAt));

    return NextResponse.json({
      customer: customer[0],
      payments: paymentHistory,
      dueEntries: dueHistory,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    const body = await req.json();
    const { name, phone, notes } = body;

    const updated = await db
      .update(customers)
      .set({
        name,
        phone,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId))
      .returning();

    return NextResponse.json({ customer: updated[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);

    await db
      .update(customers)
      .set({ isActive: false })
      .where(eq(customers.id, customerId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
