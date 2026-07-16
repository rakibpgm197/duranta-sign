import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({ orders: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      service,
      description,
      quantity,
      estimatedPrice,
      notes,
    } = body;

    if (!customerName || !customerPhone || !service || !description) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // Generate order number
    const count = await db.select().from(orders);
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(count.length + 1).padStart(4, "0")}`;

    const newOrder = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName,
        customerPhone,
        customerAddress: customerAddress || null,
        service,
        description,
        quantity: quantity || 1,
        estimatedPrice: estimatedPrice ? String(estimatedPrice) : null,
        status: "pending",
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ order: newOrder[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
