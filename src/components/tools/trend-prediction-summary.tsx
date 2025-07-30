"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, TrendingUp, Users, Hash } from "lucide-react";
import type { TrendPredictionSummaryOutput } from "@/ai/flows/trend-prediction-summary";
import { trendPredictionSummaryAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  trendTitle: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be less than 100 characters."),
  engagementStats: z.string().min(10, "Stats must be at least 10 characters.").max(500, "Stats must be less than 500 characters."),
});

export function TrendPredictor() {
  const [result, setResult] = useState<TrendPredictionSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trendTitle: "",
      engagementStats: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const actionResult = await trendPredictionSummaryAction(values);
    if (actionResult.error) {
      toast({ variant: "destructive", description: actionResult.error });
    } else {
      setResult(actionResult.data ?? null);
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Trend Predictor</CardTitle>
          <CardDescription>Analyze trend data to predict its growth potential, target industries, and key hashtags.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="trendTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trend Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'AI-Generated Influencers'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="engagementStats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engagement Statistics</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., '85% increase in mentions over last 30 days, 1.2M posts on TikTok.'" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Predict Trend
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Prediction Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg">Prediction</h3>
              </div>
              <p className="text-muted-foreground">{result.prediction}</p>
              <div className="mt-2 flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Confidence</Label>
                <Progress value={result.confidenceScore} className="w-1/2" />
                <span className="text-xs font-bold">{result.confidenceScore}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg">Target Industries</h3>
              </div>
              <p className="text-muted-foreground">{result.targetIndustries}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <Hash className="h-5 w-5 text-primary" />
                <h3 className="text-lg">Related Hashtags</h3>
              </div>
              <p className="text-muted-foreground">{result.relatedHashtags}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
