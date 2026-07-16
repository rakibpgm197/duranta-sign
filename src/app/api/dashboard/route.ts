import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, transactions, invoices, orders, reviews } from "@/db/schema";
import { eq, sql, desc, gte } from "drizzle-orm";

export async function GET() {
  try {
    // Total customers
    const totalCustomers = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(customers)
      .where(eq(customers.isActive, true));

    // Total due
    const totalDue = await db
      .select({ total: sql<number>`SUM(${customers.totalDue}::numeric)` })
      .from(customers)
      .where(eq(customers.isActive, true));

    // Total collected
    const totalPaid = await db
      .select({ total: sql<number>`SUM(${customers.totalPaid}::numeric)` })
      .from(customers)
      .where(eq(customers.isActive, true));

    // This month income/expense
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyStats = await db
      .select({
        type: transactions.type,
        total: sql<number>`SUM(${transactions.amount}::numeric)`,
      })
      .from(transactions)
      .where(gte(transactions.transactionDate, monthStart))
      .groupBy(transactions.type);

    const monthlyIncome =
      monthlyStats.find((s) => s.type === "income")?.total || 0;
    const monthlyExpense =
      monthlyStats.find((s) => s.type === "expense")?.total || 0;

    // Today stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayStats = await db
      .select({
        type: transactions.type,
        total: sql<number>`SUM(${transactions.amount}::numeric)`,
      })
      .from(transactions)
      .where(gte(transactions.transactionDate, todayStart))
      .groupBy(transactions.type);

    const todayIncome =
      todayStats.find((s) => s.type === "income")?.total || 0;
    const todayExpense =
      todayStats.find((s) => s.type === "expense")?.total || 0;

    // Pending orders
    const pendingOrders = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));

    // Pending reviews
    const pendingReviews = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(reviews)
      .where(eq(reviews.isApproved, false));

    // Recent transactions (last 10)
    const recentTransactions = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt))
      .limit(10);

    // Top debtors
    const topDebtors = await db
      .select()
      .from(customers)
      .where(eq(customers.isActive, true))
      .orderBy(desc(customers.totalDue))
      .limit(5);

    // Invoice stats
    const invoiceStats = await db
      .select({
        status: invoices.status,
        count: sql<number>`COUNT(*)`,
        total: sql<number>`SUM(${invoices.total}::numeric)`,
      })
      .from(invoices)
      .groupBy(invoices.status);

    // Monthly chart data (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayStats = await db
        .select({
          type: transactions.type,
          total: sql<number>`SUM(${transactions.amount}::numeric)`,
        })
        .from(transactions)
        .where(
          sql`${transactions.transactionDate} >= ${day} AND ${transactions.transactionDate} < ${nextDay}`
        )
        .groupBy(transactions.type);

      chartData.push({
        date: day.toLocaleDateString("bn-BD", { month: "short", day: "numeric" }),
        income: Number(dayStats.find((s) => s.type === "income")?.total || 0),
        expense: Number(dayStats.find((s) => s.type === "expense")?.total || 0),
      });
    }

    return NextResponse.json({
      stats: {
        totalCustomers: Number(totalCustomers[0]?.count || 0),
        totalDue: Number(totalDue[0]?.total || 0),
        totalPaid: Number(totalPaid[0]?.total || 0),
        monthlyIncome: Number(monthlyIncome),
        monthlyExpense: Number(monthlyExpense),
        monthlyProfit: Number(monthlyIncome) - Number(monthlyExpense),
        todayIncome: Number(todayIncome),
        todayExpense: Number(todayExpense),
        todayProfit: Number(todayIncome) - Number(todayExpense),
        pendingOrders: Number(pendingOrders[0]?.count || 0),
        pendingReviews: Number(pendingReviews[0]?.count || 0),
      },
      recentTransactions,
      topDebtors,
      invoiceStats,
      chartData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
