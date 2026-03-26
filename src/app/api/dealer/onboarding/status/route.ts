import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dealerOnboardingApplications } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        status: "draft",
        reviewStatus: null,
      });
    }

    const application = await db
      .select()
      .from(dealerOnboardingApplications)
      .where(eq(dealerOnboardingApplications.dealerUserId, user.id))
      .orderBy(desc(dealerOnboardingApplications.updatedAt))
      .limit(1);

    if (!application.length) {
      return NextResponse.json({
        status: "draft",
        reviewStatus: null,
      });
    }

    return NextResponse.json({
      status: application[0].onboardingStatus || "draft",
      reviewStatus: application[0].reviewStatus || null,
    });
  } catch (error) {
    console.error("Onboarding status fetch error:", error);
    return NextResponse.json({
      status: "draft",
      reviewStatus: null,
    });
  }
}