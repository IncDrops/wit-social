"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, Clock, CheckCircle, Lock } from "lucide-react";
import type { OptimalTimeToPostOutput } from "@/ai/flows/optimal-time-to-post";
import { getOptimalTimeToPostAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAccessStore } from "@/hooks/use-access-store";
import Link from "next/link";

const formSchema = z.object({
  platform: z.string().min(1, "Platform is required."),
  audienceData: z.string().min(20, "Audience data must be at least 20 characters.").max(2000, "Audience data must be less than 2000 characters."),
});

export function OptimalTimeToPost() {
  const [result, setResult] = useState<OptimalTimeToPostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { hasAccess, useCredit } = useAccessStore();
  const canUseTool = hasAccess();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "Instagram",
      audienceData: "Our audience is primarily in the US (EST/PST). Peak active times are 9-11am EST on weekdays and 7-10pm EST on weekends. We see a smaller peak around 1pm PST daily.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!canUseTool) {
        toast({ variant: "destructive", description: "You need to purchase access to use this tool."});
        return;
    }
    setIsLoading(true);
    setResult(null);
    const actionResult = await getOptimalTimeToPostAction(values, { hasAccess: canUseTool });
    if (actionResult.error) {
      toast({ variant: "destructive", description: actionResult.error });
    } else {
      setResult(actionResult.data ?? null);
      useCredit();
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Optimal Time to Post</CardTitle>
          <CardDescription>Get the top 3 posting windows for your audience, with explanations for why they work.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Twitter">X (Twitter)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="audienceData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your audience's peak times, timezones, and any other relevant data..." {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button type="submit" disabled={isLoading || !canUseTool}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (canUseTool ? <Sparkles className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />)}
                Get Recommendations
              </Button>
               {!canUseTool && (
                 <p className="text-xs text-muted-foreground">
                    You're out of credits. <Button variant="link" asChild className="p-0 h-auto"><Link href="/?tool=billing">Purchase more</Link></Button> to continue.
                </p>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && result.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Posting Windows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg border bg-background/50">
                <div className="flex items-center font-semibold text-primary mb-2">
                  <Clock className="mr-2 h-5 w-5" />
                  <h3 className="text-lg">{rec.timeWindow}</h3>
                </div>
                <div className="flex items-start text-muted-foreground">
                    <CheckCircle className="mr-2 h-4 w-4 mt-1 text-green-500 shrink-0"/>
                    <p>{rec.reason}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
