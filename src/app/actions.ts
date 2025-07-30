
"use server";

import { analyzeAttentionHook, type AnalyzeAttentionHookInput } from "@/ai/flows/attention-hook-analyzer";
import { optimizeCaption, type OptimizeCaptionInput } from "@/ai/flows/caption-optimizer";
import { generateHashtags, type GenerateHashtagsInput } from "@/ai/flows/hashtag-generator";
import { getOptimalTimeToPost, type OptimalTimeToPostInput } from "@/ai/flows/optimal-time-to-post";
import { trendPredictionSummary, type TrendPredictionSummaryInput } from "@/ai/flows/trend-prediction-summary";
import { generateViralPostIdeas, type ViralPostIdeasInput } from "@/ai/flows/viral-post-idea-generator";
import { generateShareLink, type GenerateShareLinkInput } from "@/ai/flows/content-sharer";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

interface ActionParams {
  hasAccess: boolean;
}

export async function generateViralPostIdeasAction(input: ViralPostIdeasInput, params: ActionParams) {
  if (!params.hasAccess) return { error: "You need to purchase access to use this tool." };
  try {
    const result = await generateViralPostIdeas(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate ideas. Please try again." };
  }
}

export async function optimizeCaptionAction(input: OptimizeCaptionInput, params: ActionParams) {
  if (!params.hasAccess) return { error: "You need to purchase access to use this tool." };
  try {
    const result = await optimizeCaption(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to optimize caption. Please try again." };
  }
}

export async function trendPredictionSummaryAction(input: TrendPredictionSummaryInput, params: ActionParams) {
    if (!params.hasAccess) return { error: "You need to purchase access to use this tool." };
  try {
    const result = await trendPredictionSummary(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate prediction. Please try again." };
  }
}

export async function getOptimalTimeToPostAction(input: OptimalTimeToPostInput, params: ActionParams) {
    if (!params.hasAccess) return { error: "You need to purchase access to use this tool." };
  try {
    const result = await getOptimalTimeToPost(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get optimal times. Please try again." };
  }
}

export async function generateHashtagsAction(input: GenerateHashtagsInput, params: ActionParams) {
    if (!params.hasAccess) return { error: "You need to purchase access to use this tool." };
  try {
    const result = await generateHashtags(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate hashtags. Please try again." };
  }
}

export async function analyzeAttentionHookAction(input: AnalyzeAttentionHookInput, params: ActionParams) {
    if (!params.hasAccess) return { error: "You need to purchase access to use this tool." };
  try {
    const result = await analyzeAttentionHook(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to analyze hook. Please try again." };
  }
}

export async function generateShareLinkAction(input: GenerateShareLinkInput) {
  try {
    const result = await generateShareLink(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate link. Please try again." };
  }
}

export async function createCheckoutSessionAction({ priceId }: { priceId: string }) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local file." };
  }
  if (!priceId) {
    return { error: "Price ID was not provided. Please select a product." };
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2024-06-20",
  });
  
  // When deployed, Firebase App Hosting provides this environment variable.
  // For local testing, we fall back to the URL defined in .env.local.
  const appUrl = process.env.FIREBASE_APP_HOSTING_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    const errorMessage = "Could not determine the redirect URL. Please ensure NEXT_PUBLIC_APP_URL is set in your .env.local file for local development.";
    console.error(errorMessage);
    return { error: errorMessage };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
      metadata: {
        priceId: priceId,
      }
    });

    if (!session.url) {
      return { error: "Could not create Stripe checkout session. Please try again." };
    }

    return { data: { url: session.url } };
  } catch (error: any) {
    console.error("Stripe Error:", error.message);
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}

export async function verifyCheckoutSessionAction({ sessionId }: { sessionId: string }) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe is not configured." };
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const priceId = session.metadata?.priceId;
      
      const passPriceId = process.env.NEXT_PUBLIC_STRIPE_PASS_PRICE_ID;
      if (priceId === passPriceId) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        
        return { 
          data: { 
            success: true, 
            message: "Payment verified successfully. You have 2 credits for 24 hours.",
            accessType: 'pass',
            creditsAdded: 2,
            expiresAt: expiresAt.toISOString(),
          } 
        };
      }

      const creatorPriceId = process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID;
      const agencyPriceId = process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID;
      let credits = 0;

      if (priceId === creatorPriceId) credits = 50;
      if (priceId === agencyPriceId) credits = 500;
      
      if (credits > 0) {
        return {
          data: {
            success: true,
            message: `Payment verified successfully. ${credits} credits have been added.`,
            accessType: 'credits',
            creditsAdded: credits,
          }
        };
      }

      return { data: { success: true, message: "Payment verified successfully." } };
    } else {
      return { error: `Payment not successful. Status: ${session.payment_status}` };
    }
  } catch (error: any) {
    console.error("Error verifying checkout session:", error.message);
    return { error: `An unexpected error occurred during verification: ${error.message}` };
  }
}
