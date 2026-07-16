import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers, payments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    const body = await req.json();
    const { amount, note } = body;

    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // Insert payment record
    const payment = await db
      .insert(payments)
      .values({
        customerId,
        amount: String(amount),
        note: note || null,
        paidAt: new Date(),
      })
      .returning();

    // Update customer totals
    await db
      .update(customers)
      .set({
        totalPaid: sql`${customers.totalPaid} + ${amount}`,
        totalDue: sql`${customers.totalDue} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));

    return NextResponse.json({ payment: payment[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
