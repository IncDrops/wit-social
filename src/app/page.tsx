
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { verifyCheckoutSessionAction } from "@/app/actions";

export default function Home() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      const verifySession = async () => {
        const result = await verifyCheckoutSessionAction({ sessionId });
        if (result.error) {
          toast({
            variant: "destructive",
            title: "Payment Verification Failed",
            description: result.error,
          });
        } else if (result.data?.success) {
           toast({
            title: "Payment Successful!",
            description: "Thank you for your purchase. Your access has been granted.",
          });
          // In a real app, this is where you would grant credits or access.
          // For now, we clear the URL parameter to prevent re-triggering.
          window.history.replaceState(null, "", window.location.pathname);
        }
      };
      verifySession();
    }
  }, [searchParams, toast]);

  return <DashboardLayout />;
}
