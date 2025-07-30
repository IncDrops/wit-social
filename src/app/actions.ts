"use server";

import { analyzeAttentionHook, type AnalyzeAttentionHookInput } from "@/ai/flows/attention-hook-analyzer";
import { optimizeCaption, type OptimizeCaptionInput } from "@/ai/flows/caption-optimizer";
import { generateHashtags, type GenerateHashtagsInput } from "@/ai/flows/hashtag-generator";
import { getOptimalTimeToPost, type OptimalTimeToPostInput } from "@/ai/flows/optimal-time-to-post";
import { trendPredictionSummary, type TrendPredictionSummaryInput } from "@/ai/flows/trend-prediction-summary";
import { generateViralPostIdeas, type ViralPostIdeasInput } from "@/ai/flows/viral-post-idea-generator";
import { generateShareLink, type GenerateShareLinkInput } from "@/ai/flows/content-sharer";
import Stripe from "stripe";

export async function generateViralPostIdeasAction(input: ViralPostIdeasInput) {
  try {
    const result = await generateViralPostIdeas(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate ideas. Please try again." };
  }
}

export async function optimizeCaptionAction(input: OptimizeCaptionInput) {
  try {
    const result = await optimizeCaption(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to optimize caption. Please try again." };
  }
}

export async function trendPredictionSummaryAction(input: TrendPredictionSummaryInput) {
  try {
    const result = await trendPredictionSummary(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate prediction. Please try again." };
  }
}

export async function getOptimalTimeToPostAction(input: OptimalTimeToPostInput) {
  try {
    const result = await getOptimalTimeToPost(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get optimal times. Please try again." };
  }
}

export async function generateHashtagsAction(input: GenerateHashtagsInput) {
  try {
    const result = await generateHashtags(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate hashtags. Please try again." };
  }
}

export async function analyzeAttentionHookAction(input: AnalyzeAttentionHookInput) {
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
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." };
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9004";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
    });

    if (!session.url) {
      return { error: "Could not create Stripe checkout session. Please try again." };
    }

    return { data: { url: session.url } };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred while creating the checkout session." };
  }
}

export async function verifyCheckoutSessionAction({ sessionId }: { sessionId: string }) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe is not configured." };
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // Here you would typically fulfill the order, e.g.,
      // - Look up the customer in your database.
      // - Add credits to their account.
      // - Generate and store an access token.
      console.log("Payment for session " + sessionId + " was successful.");
      return { data: { success: true, message: "Payment verified successfully." } };
    } else {
      return { error: `Payment not successful. Status: ${session.payment_status}` };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to verify checkout session." };
  }
}
