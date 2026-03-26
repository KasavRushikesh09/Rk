"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

type StatusType =
  | "draft"
  | "submitted"
  | "pending_sales_head"
  | "under_review"
  | "action_needed"
  | "approved";

export default function OnboardingStatusPage() {
  const [status, setStatus] = useState<StatusType>("submitted");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/dealer/onboarding/status", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        setStatus((data?.status || "submitted") as StatusType);
      } catch (error) {
        console.error("Failed to fetch onboarding status:", error);
        setStatus("submitted");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const statusMap: Record<
    StatusType,
    {
      eyebrow: string;
      title: string;
      message: string;
      helper: string;
      icon: React.ReactNode;
      tone: string;
    }
  > = {
    draft: {
      eyebrow: "Onboarding Draft",
      title: "Application Not Submitted Yet",
      message:
        "Your dealer onboarding is still in draft mode. Please complete all required steps and submit your application.",
      helper: "Complete the pending sections to move your application forward.",
      icon: <Clock className="h-12 w-12 text-slate-600" />,
      tone: "border-slate-200 bg-slate-50",
    },
    submitted: {
      eyebrow: "Application Submitted",
      title: "Submitted Successfully",
      message:
        "Your dealer onboarding application has been submitted successfully and is waiting for internal verification.",
      helper:
        "Our team will review your submitted details, compliance documents, and agreement configuration.",
      icon: <Clock className="h-12 w-12 text-blue-600" />,
      tone: "border-blue-200 bg-blue-50",
    },
    pending_sales_head: {
      eyebrow: "Sales Head Verification",
      title: "Pending Sales Head Review",
      message:
        "Your onboarding request has been forwarded to the Sales Head for verification before further processing.",
      helper:
        "This review helps prevent wrong signer emails, incorrect GST/PAN mapping, and legal mistakes.",
      icon: <ShieldCheck className="h-12 w-12 text-indigo-600" />,
      tone: "border-indigo-200 bg-indigo-50",
    },
    under_review: {
      eyebrow: "Under Review",
      title: "Application Under Review",
      message:
        "Your application is currently under review by the iTarang team. We will notify you once verification is complete.",
      helper:
        "Please wait while the submitted details and onboarding configuration are being reviewed.",
      icon: <Clock className="h-12 w-12 text-amber-600" />,
      tone: "border-amber-200 bg-amber-50",
    },
    action_needed: {
      eyebrow: "Action Required",
      title: "Corrections Required",
      message:
        "Some documents or details need correction before your onboarding can proceed.",
      helper:
        "Please go back to the onboarding flow, update the requested details, and submit again.",
      icon: <AlertTriangle className="h-12 w-12 text-red-600" />,
      tone: "border-red-200 bg-red-50",
    },
    approved: {
      eyebrow: "Onboarding Approved",
      title: "Dealer Onboarding Approved",
      message:
        "Congratulations. Your dealership is now approved and finance-enabled on the iTarang platform.",
      helper:
        "You can now access the full dealer dashboard and continue with normal dealer operations.",
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-600" />,
      tone: "border-emerald-200 bg-emerald-50",
    },
  };

  const current = statusMap[status] || statusMap.submitted;

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F5F7FA]">
        <div className="rounded-3xl border border-[#E3E8EF] bg-white px-8 py-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Loading onboarding status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#F5F7FA] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-[#E3E8EF] bg-gradient-to-br from-white to-[#F7FAFD] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1F5C8F]">
            Dealer Onboarding Status
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#173F63]">
            Track Your Application Progress
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
            This page shows the current onboarding stage for your dealership and
            what happens next in the verification workflow.
          </p>
        </div>

        <div
          className={`rounded-3xl border p-10 text-center shadow-sm ${current.tone}`}
        >
          <div className="mb-4 flex justify-center">{current.icon}</div>

          <p className="text-sm font-semibold uppercase tracking-wide text-[#1F5C8F]">
            {current.eyebrow}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#173F63]">
            {current.title}
          </h2>

          <p className="mt-4 text-base text-slate-700">{current.message}</p>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
            {current.helper}
          </p>

          <div className="mt-8">
            {status === "approved" ? (
              <a
                href="/dealer-portal"
                className="inline-flex items-center rounded-2xl bg-[#1F5C8F] px-6 py-3 font-semibold text-white transition hover:bg-[#173F63]"
              >
                Go to Dealer Dashboard
              </a>
            ) : status === "action_needed" || status === "draft" ? (
              <a
                href="/dealer-onboarding"
                className="inline-flex items-center rounded-2xl bg-[#1F5C8F] px-6 py-3 font-semibold text-white transition hover:bg-[#173F63]"
              >
                Go Back to Onboarding
              </a>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E3E8EF] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#173F63]">
            What happens next
          </h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-[#E3E8EF] bg-[#FAFBFC] px-4 py-3 text-sm text-slate-700">
              1. Application data is reviewed by the internal verification team.
            </div>
            <div className="rounded-2xl border border-[#E3E8EF] bg-[#FAFBFC] px-4 py-3 text-sm text-slate-700">
              2. Sales Head verifies business, compliance, and agreement setup.
            </div>
            <div className="rounded-2xl border border-[#E3E8EF] bg-[#FAFBFC] px-4 py-3 text-sm text-slate-700">
              3. Once approved, your dealer account is activated for dashboard access.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}