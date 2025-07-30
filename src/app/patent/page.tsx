
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PatentPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
         <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Patent Pending Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <p className="text-foreground font-semibold">WillItTrend.com by IncDrops LLC</p>
            
            <div>
                <h2 className="text-xl font-semibold text-foreground">1. AI Trend Prediction System</h2>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Real-time engagement velocity analysis</li>
                    <li>Cross-platform virality scoring algorithm</li>
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-foreground">2. Dynamic Credit Allocation</h2>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Usage-based AI credit throttling</li>
                    <li>Anonymous user attribution</li>
                </ul>
            </div>
            
            <div>
                <h2 className="text-xl font-semibold text-foreground">3. No-Auth Payment Gateway</h2>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Stripe-to-Firebase zero-trust reconciliation</li>
                </ul>
            </div>

            <p className="text-sm">These methodologies are proprietary. Unauthorized commercialization or replication is prohibited.</p>
            
            <p className="text-xs pt-4">© 2024 IncDrops LLC. All rights reserved.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
