"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, ClipboardCopy } from "lucide-react";
import type { OptimizeCaptionOutput } from "@/ai/flows/caption-optimizer";
import { optimizeCaptionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  platform: z.string().min(1, "Platform is required."),
  userInput: z.string().min(10, "Caption must be at least 10 characters.").max(1000, "Caption must be less than 1000 characters."),
  tone: z.enum(["shorter", "wittier", "emotional"]),
  characterLimit: z.number().min(50).max(2200),
});

export function CaptionOptimizer() {
  const [result, setResult] = useState<OptimizeCaptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "Instagram",
      userInput: "",
      tone: "wittier",
      characterLimit: 280,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const actionResult = await optimizeCaptionAction(values);
    if (actionResult.error) {
      toast({ variant: "destructive", description: actionResult.error });
    } else {
      setResult(actionResult.data ?? null);
    }
    setIsLoading(false);
  }
  
  const copyToClipboard = () => {
    if (result?.optimizedCaption) {
      navigator.clipboard.writeText(result.optimizedCaption);
      toast({ description: "Caption copied to clipboard!" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Caption Optimizer</CardTitle>
          <CardDescription>Improve your caption for maximum engagement. Let AI make it shorter, wittier, or more emotional.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="shorter">Shorter</SelectItem>
                          <SelectItem value="wittier">Wittier</SelectItem>
                          <SelectItem value="emotional">Emotional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="characterLimit"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Character Limit</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={50}
                        max={2200}
                        step={10}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Caption</FormLabel>
                    <FormControl>
                      <Textarea placeholder='e.g., "Check out our new product!"' {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Optimize Caption
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Optimized Caption</CardTitle>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <ClipboardCopy className="h-5 w-5" />
                <span className="sr-only">Copy</span>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{result.optimizedCaption}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
