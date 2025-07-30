'use server';

/**
 * @fileOverview Summarizes trend data to predict growth, target industries, and hashtags.
 *
 * - trendPredictionSummary - Function to generate a trend prediction summary.
 * - TrendPredictionSummaryInput - Input type for the trendPredictionSummary function.
 * - TrendPredictionSummaryOutput - Output type for the trendPredictionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendPredictionSummaryInputSchema = z.object({
  trendTitle: z.string().describe('The title of the trend.'),
  engagementStats: z.string().describe('Engagement statistics for the trend.'),
});
export type TrendPredictionSummaryInput = z.infer<typeof TrendPredictionSummaryInputSchema>;

const TrendPredictionSummaryOutputSchema = z.object({
  prediction: z.string().describe('A summary predicting whether the trend will grow or fade.'),
  confidenceScore: z.number().describe('The confidence score (0-100) for the prediction.'),
  targetIndustries: z.string().describe('Industries that should capitalize on the trend.'),
  relatedHashtags: z.string().describe('Key related hashtags for the trend.'),
});
export type TrendPredictionSummaryOutput = z.infer<typeof TrendPredictionSummaryOutputSchema>;

export async function trendPredictionSummary(input: TrendPredictionSummaryInput): Promise<TrendPredictionSummaryOutput> {
  return trendPredictionSummaryFlow(input);
}

const trendPredictionSummaryPrompt = ai.definePrompt({
  name: 'trendPredictionSummaryPrompt',
  input: {schema: TrendPredictionSummaryInputSchema},
  output: {schema: TrendPredictionSummaryOutputSchema},
  prompt: `Analyze this trend data: Trend Title: {{{trendTitle}}}, Engagement Stats: {{{engagementStats}}}.\n\nPredict:\n- Will this trend grow or fade? (Confidence: %)\n- Who should capitalize? (Industries)\n- Key related hashtags\n\nExample Output:\n"Prediction: 'AI Influencers' will grow (+85% confidence).\nBest for: Marketing agencies, tech brands.\nHashtags: #AIinfluencers #DigitalHumans"
`,
});

const trendPredictionSummaryFlow = ai.defineFlow(
  {
    name: 'trendPredictionSummaryFlow',
    inputSchema: TrendPredictionSummaryInputSchema,
    outputSchema: TrendPredictionSummaryOutputSchema,
  },
  async input => {
    const {output} = await trendPredictionSummaryPrompt(input);
    return output!;
  }
);
