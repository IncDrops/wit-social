
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { runTrendDiscoveryAction } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function AdminTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleRunDiscovery = async () => {
    setIsLoading(true);
    setResult(null);
    const actionResult = await runTrendDiscoveryAction();
    if (actionResult.error) {
      setResult({ success: false, message: actionResult.error });
    } else if (actionResult.data) {
      setResult({ success: true, message: actionResult.data.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Admin Tools</CardTitle>
          <CardDescription>
            Manually run administrative tasks. Use these tools for debugging or
            to force-trigger processes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <p className="font-medium">Daily Trend Discovery</p>
            <Button onClick={handleRunDiscovery} disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Run Now
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            This will trigger the AI to discover new trends and save them to the
            database. This is the same process that runs automatically once per
            day.
          </p>
        </CardContent>
      </Card>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {result.success ? "Execution Successful" : "Execution Failed"}
          </AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
