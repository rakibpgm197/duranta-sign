import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers, dueEntries } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    const body = await req.json();
    const { amount, description, dueDate } = body;

    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // Insert due entry
    const entry = await db
      .insert(dueEntries)
      .values({
        customerId,
        amount: String(amount),
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning();

    // Update customer total due
    await db
      .update(customers)
      .set({
        totalDue: sql`${customers.totalDue} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));

    return NextResponse.json({ dueEntry: entry[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add due entry" },
      { status: 500 }
    );
  }
}
