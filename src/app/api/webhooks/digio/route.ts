import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dealerOnboardingApplications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("DIGIO WEBHOOK RECEIVED:", body);

    const documentId = body.document_id;
    const status = body.status;
    const requestId = body.request_id || null;

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          message: "document_id is required in Digio webhook",
        },
        { status: 400 }
      );
    }

    let agreementStatus = "draft_generated";
    let completionStatus = "Pending";

    if (status === "draft") {
      agreementStatus = "draft_generated";
      completionStatus = "Draft Generated";
    }

    if (status === "sent") {
      agreementStatus = "sent_for_signature";
      completionStatus = "Sent for Signature";
    }

    if (status === "viewed") {
      agreementStatus = "viewed_by_dealer";
      completionStatus = "Viewed by Dealer";
    }

    if (status === "completed") {
      agreementStatus = "completed";
      completionStatus = "Completed";
    }

    if (status === "expired") {
      agreementStatus = "expired";
      completionStatus = "Expired";
    }

    if (status === "failed") {
      agreementStatus = "failed";
      completionStatus = "Failed";
    }

    await db
      .update(dealerOnboardingApplications)
      .set({
        agreementStatus,
        completionStatus,
        providerDocumentId: documentId,
        requestId,
        providerRawResponse: body,
        signedAt: agreementStatus === "completed" ? new Date() : null,
        lastActionTimestamp: new Date(),
        onboardingStatus:
          agreementStatus === "completed" ? "under_review" : undefined,
        updatedAt: new Date(),
      })
      .where(eq(dealerOnboardingApplications.providerDocumentId, documentId));

    console.log("Webhook processed for document:", documentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DIGIO WEBHOOK ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Digio webhook processing failed",
      },
      { status: 500 }
    );
  }
}