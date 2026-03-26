import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dealerOnboardingApplications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  _req: NextRequest,
  { params }: { params: { dealerId: string } }
) {
  try {
    const dealerId = params.dealerId;

    const application = await db
      .select()
      .from(dealerOnboardingApplications)
      .where(eq(dealerOnboardingApplications.id, dealerId));

    const app = application[0];

    if (!app) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // TODO: Call Digio API here
    // For now we simulate Digio response
    const fakeDigioResponse = {
      document_id: "DOC_" + Date.now(),
      request_id: "REQ_" + Date.now(),
      signing_url: "https://digio.in/sign/" + dealerId,
      status: "sent",
    };

    await db
      .update(dealerOnboardingApplications)
      .set({
        agreementStatus: "sent_for_signature",
        providerDocumentId: fakeDigioResponse.document_id,
        requestId: fakeDigioResponse.request_id,
        providerSigningUrl: fakeDigioResponse.signing_url,
        lastActionTimestamp: new Date(),
      })
      .where(eq(dealerOnboardingApplications.id, dealerId));

    return NextResponse.json({
      success: true,
      signingUrl: fakeDigioResponse.signing_url,
    });
  } catch (error: any) {
    console.error("INITIATE AGREEMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}