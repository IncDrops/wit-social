
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { verifyCheckoutSessionAction } from "@/app/actions";
import { useAccessStore } from "@/hooks/use-access-store";

export default function Home() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setAccessPass, addCredits } = useAccessStore();
  const [activeTool, setActiveTool] = useState("trends");

  useEffect(() => {
    const tool = searchParams.get("tool");
    if (tool) {
      setActiveTool(tool);
       // Optional: clear the URL parameter
       window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams]);

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
            description: result.data.message,
          });

          // Handle access grant
          if (result.data.accessType === 'pass' && result.data.expiresAt && result.data.creditsAdded) {
            setAccessPass(result.data.expiresAt, result.data.creditsAdded);
          } else if (result.data.accessType === 'credits' && result.data.creditsAdded) {
            addCredits(result.data.creditsAdded);
          }

          // Clear the URL parameter to prevent re-triggering.
          window.history.replaceState(null, "", window.location.pathname);
        }
      };
      verifySession();
    }
  }, [searchParams, toast, setAccessPass, addCredits]);

  return <DashboardLayout initialTool={activeTool} />;
}
