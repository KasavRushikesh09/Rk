"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DealerDashboard from "@/components/dealer-dashboard/DealerDashboard";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DealerPortalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [statusLoading, setStatusLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<string>("draft");

  useEffect(() => {
    if (!user) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/dealer/onboarding/status");
        const data = await res.json();

        setOnboardingStatus(data.status);
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
  }, [user]);

  useEffect(() => {
    if (statusLoading) return;

    if (onboardingStatus === "draft" || onboardingStatus === "in_progress") {
      router.push("/dealer-onboarding");
      return;
    }

    if (
      onboardingStatus === "submitted" ||
      onboardingStatus === "pending_sales_head" ||
      onboardingStatus === "under_review"
    ) {
      router.push("/dealer-portal/onboarding-status");
      return;
    }

    if (onboardingStatus === "action_needed") {
      router.push("/dealer-onboarding");
      return;
    }

    if (onboardingStatus === "approved") {
      return;
    }

    router.push("/dealer-onboarding");
  }, [statusLoading, onboardingStatus, router]);

  if (loading || statusLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-slate-500">Loading dealer portal...</p>
      </div>
    );
  }

  if (onboardingStatus !== "approved") {
    return null;
  }

  return <DealerDashboard />;
}