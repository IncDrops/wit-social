"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { createCheckoutSessionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const tiers = [
  {
    name: "Starter Pack",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PASS_PRICE_ID,
    price: "$5",
    priceDescription: "2 credits, 24-hour access",
    description: "Perfect for trying out the tools for a specific project.",
    features: [
      "2 credits to use on any tool",
      "Credits expire after 24 hours",
      "Great for a single-day session",
    ],
    cta: "Get Started",
  },
  {
    name: "Creator Pack",
    priceId: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID,
    price: "$100",
    priceDescription: "50 credits ($2/credit)",
    description: "Ideal for regular content creators and small businesses.",
    features: [
      "50 credits to use on any tool",
      "1 credit = 1 full tool usage",
      "Credits never expire",
    ],
    cta: "Buy Credits",
    popular: true,
  },
  {
    name: "Agency Bundle",
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
    price: "$500",
    priceDescription: "500 credits ($1/credit)",
    description: "Best value for power users and marketing agencies.",
    features: [
      "500 credits to use on any tool",
      "Best value at $1 per credit",
      "Credits never expire",
    ],
    cta: "Buy Credits",
  },
];

export function Billing() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckout = async (priceId: string | undefined) => {
    if (!priceId) {
      toast({
        variant: "destructive",
        description: "This product is not configured yet. Please check back later.",
      });
      return;
    }
    setIsLoading(priceId);
    const result = await createCheckoutSessionAction({ priceId });

    if (result.error || !result.data?.url) {
      toast({
        variant: "destructive",
        description: result.error || "Could not redirect to checkout.",
      });
      setIsLoading(null);
      return;
    }

    window.location.href = result.data.url;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground mt-2">
          Choose the plan that's right for you. No subscriptions, no hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <Card key={tier.name} className={cn("flex flex-col", tier.popular && "border-primary border-2 relative")}>
             {tier.popular && (
              <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-semibold">
                <Star className="mr-2 h-4 w-4" />
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <p className="text-4xl font-bold">{tier.price}</p>
              <p className="text-sm text-muted-foreground">{tier.priceDescription}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-center text-muted-foreground mb-6">{tier.description}</p>
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={tier.popular ? "default" : "outline"}
                onClick={() => handleCheckout(tier.priceId)}
                disabled={isLoading === tier.priceId}
              >
                {isLoading === tier.priceId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
