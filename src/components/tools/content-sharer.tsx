"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Share2, ClipboardCopy } from "lucide-react";
import type { GenerateShareLinkOutput } from "@/ai/flows/content-sharer";
import { generateShareLinkAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { format } from "date-fns";

const formSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters.").max(5000, "Content must be less than 5000 characters."),
});

export function ContentSharer() {
  const [result, setResult] = useState<GenerateShareLinkOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const actionResult = await generateShareLinkAction(values);
    if (actionResult.error) {
      toast({ variant: "destructive", description: actionResult.error });
    } else {
      setResult(actionResult.data ?? null);
    }
    setIsLoading(false);
  }

  const copyToClipboard = () => {
    if (result?.shareUrl) {
      navigator.clipboard.writeText(result.shareUrl);
      toast({ description: "Link copied to clipboard!" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Content Sharer</CardTitle>
          <CardDescription>Generate a unique, temporary link to share content with anyone. The link will expire in 24 hours.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content to Share</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste or write the content you want to share..." {...field} rows={8} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                Generate Share Link
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Shareable Link</CardTitle>
            <CardDescription>
                This link will expire on {format(new Date(result.expiresAt), "PPP p")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
                <Input value={result.shareUrl} readOnly />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <ClipboardCopy className="h-5 w-5" />
                    <span className="sr-only">Copy</span>
                </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
