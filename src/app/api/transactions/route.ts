import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { desc, gte, lte, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const conditions = [];
    if (from) conditions.push(gte(transactions.transactionDate, new Date(from)));
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      conditions.push(lte(transactions.transactionDate, toDate));
    }

    const result = await db
      .select()
      .from(transactions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(transactions.transactionDate));

    // Calculate summary
    const summary = await db
      .select({
        type: transactions.type,
        total: sql<number>`SUM(${transactions.amount}::numeric)`,
      })
      .from(transactions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(transactions.type);

    const income = summary.find((s) => s.type === "income")?.total || 0;
    const expense = summary.find((s) => s.type === "expense")?.total || 0;

    return NextResponse.json({
      transactions: result,
      summary: {
        income: Number(income),
        expense: Number(expense),
        profit: Number(income) - Number(expense),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, category, amount, description, transactionDate } = body;

    if (!type || !amount) {
      return NextResponse.json(
        { error: "Type and amount are required" },
        { status: 400 }
      );
    }

    const newTransaction = await db
      .insert(transactions)
      .values({
        type,
        category: category || null,
        amount: String(amount),
        description: description || null,
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
      })
      .returning();

    return NextResponse.json(
      { transaction: newTransaction[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
