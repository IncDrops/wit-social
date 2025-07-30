"use server";

import { analyzeAttentionHook, type AnalyzeAttentionHookInput } from "@/ai/flows/attention-hook-analyzer";
import { optimizeCaption, type OptimizeCaptionInput } from "@/ai/flows/caption-optimizer";
import { generateHashtags, type GenerateHashtagsInput } from "@/ai/flows/hashtag-generator";
import { getOptimalTimeToPost, type OptimalTimeToPostInput } from "@/ai/flows/optimal-time-to-post";
import { trendPredictionSummary, type TrendPredictionSummaryInput } from "@/ai/flows/trend-prediction-summary";
import { generateViralPostIdeas, type ViralPostIdeasInput } from "@/ai/flows/viral-post-idea-generator";

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
