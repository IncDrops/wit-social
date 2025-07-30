"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, ClipboardCopy, Lock } from "lucide-react";
import type { GenerateHashtagsOutput } from "@/ai/flows/hashtag-generator";
import { generateHashtagsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Slider } from "../ui/slider";
import { useAccessStore } from "@/hooks/use-access-store";
import Link from "next/link";

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters.").max(50, "Topic must be less than 50 characters."),
  platform: z.string().min(1, "Platform is required."),
  number: z.number().min(3).max(30),
});

export function HashtagGenerator() {
  const [result, setResult] = useState<GenerateHashtagsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { hasAccess, useCredit } = useAccessStore();
  const canUseTool = hasAccess();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      platform: "Instagram",
      number: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!canUseTool) {
        toast({ variant: "destructive", description: "You need to purchase access to use this tool."});
        return;
    }
    setIsLoading(true);
    setResult(null);
    const actionResult = await generateHashtagsAction(values, { hasAccess: canUseTool });
    if (actionResult.error) {
      toast({ variant: "destructive", description: actionResult.error });
    } else {
      setResult(actionResult.data ?? null);
      useCredit();
    }
    setIsLoading(false);
  }
  
  const copyToClipboard = () => {
    if (result?.hashtags) {
      navigator.clipboard.writeText(result.hashtags.join(' '));
      toast({ description: "Hashtags copied to clipboard!" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hashtag Generator</CardTitle>
          <CardDescription>Generate a mix of high-volume, niche, and branded hashtags for your topic.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fitness, SaaS, Cooking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Number of Hashtags</FormLabel>
                      <span className="text-sm text-muted-foreground">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={3}
                        max={30}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button type="submit" disabled={isLoading || !canUseTool}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (canUseTool ? <Sparkles className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />)}
                Generate Hashtags
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

      {result && result.hashtags.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Hashtags</CardTitle>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <ClipboardCopy className="h-5 w-5" />
              <span className="sr-only">Copy</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
