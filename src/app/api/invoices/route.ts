import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(invoices)
      .orderBy(desc(invoices.createdAt));

    return NextResponse.json({ invoices: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      customerName,
      customerPhone,
      items,
      subtotal,
      discount,
      total,
      paid,
      due,
      status,
      notes,
    } = body;

    // Generate invoice number
    const count = await db.select().from(invoices);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count.length + 1).padStart(4, "0")}`;

    const newInvoice = await db
      .insert(invoices)
      .values({
        invoiceNumber,
        customerId: customerId || null,
        customerName,
        customerPhone: customerPhone || null,
        items: JSON.stringify(items),
        subtotal: String(subtotal),
        discount: String(discount || 0),
        total: String(total),
        paid: String(paid || 0),
        due: String(due || 0),
        status: status || "pending",
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ invoice: newInvoice[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
