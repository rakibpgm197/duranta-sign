import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    let result;
    if (all) {
      result = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    } else {
      result = await db
        .select()
        .from(reviews)
        .where(eq(reviews.isApproved, true))
        .orderBy(desc(reviews.createdAt));
    }

    return NextResponse.json({ reviews: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewerName, reviewerPhone, rating, comment, service } = body;

    if (!reviewerName || !rating) {
      return NextResponse.json(
        { error: "Name and rating are required" },
        { status: 400 }
      );
    }

    const newReview = await db
      .insert(reviews)
      .values({
        reviewerName,
        reviewerPhone: reviewerPhone || null,
        rating: parseInt(rating),
        comment: comment || null,
        service: service || null,
        isApproved: false,
      })
      .returning();

    return NextResponse.json({ review: newReview[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
