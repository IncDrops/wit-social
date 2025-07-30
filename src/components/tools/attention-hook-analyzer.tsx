"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, Star } from "lucide-react";
import type { AnalyzeAttentionHookOutput } from "@/ai/flows/attention-hook-analyzer";
import { analyzeAttentionHookAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  platform: z.string().min(1, "Platform is required."),
  userInput: z.string().min(10, "Hook must be at least 10 characters.").max(300, "Hook must be less than 300 characters."),
});

export function HookAnalyzer() {
  const [result, setResult] = useState<AnalyzeAttentionHookOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "TikTok",
      userInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const actionResult = await analyzeAttentionHookAction(values);
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
          <CardTitle>Attention Hook Analyzer</CardTitle>
          <CardDescription>Rate your post hook from 1-10 and get feedback on how to improve it.</CardDescription>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
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
                name="userInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hook</FormLabel>
                    <FormControl>
                      <Textarea placeholder='e.g., "You won’t believe what happens next..."' {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Hook
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Rating:</h3>
                <Badge variant="default" className="text-lg px-4 py-2">
                    <Star className="mr-2 h-5 w-5 text-yellow-400" />
                    {result.rating}/10
                </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Feedback:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{result.feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
