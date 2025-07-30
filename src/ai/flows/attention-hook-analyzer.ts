'use server';

/**
 * @fileOverview An AI agent that analyzes the quality and effectiveness of social media hooks.
 *
 * - analyzeAttentionHook - A function that handles the analysis of attention hooks.
 * - AnalyzeAttentionHookInput - The input type for the analyzeAttentionHook function.
 * - AnalyzeAttentionHookOutput - The return type for the analyzeAttentionHook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAttentionHookInputSchema = z.object({
  platform: z
    .string()
    .describe('The social media platform (e.g., TikTok, Instagram, LinkedIn).'),
  userInput: z.string().describe('The social media hook to analyze.'),
});
export type AnalyzeAttentionHookInput = z.infer<typeof AnalyzeAttentionHookInputSchema>;

const AnalyzeAttentionHookOutputSchema = z.object({
  rating: z
    .number()
    .min(1)
    .max(10)
    .describe('A rating from 1 to 10 indicating the hook quality.'),
  feedback: z.string().describe('Feedback on the hook, including strengths, weaknesses, and how to improve it.'),
});
export type AnalyzeAttentionHookOutput = z.infer<typeof AnalyzeAttentionHookOutputSchema>;

export async function analyzeAttentionHook(
  input: AnalyzeAttentionHookInput
): Promise<AnalyzeAttentionHookOutput> {
  return analyzeAttentionHookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'attentionHookAnalyzerPrompt',
  input: {schema: AnalyzeAttentionHookInputSchema},
  output: {schema: AnalyzeAttentionHookOutputSchema},
  prompt: `You are a social media marketing expert.

You will analyze the quality and effectiveness of a social media hook and provide feedback on how to improve it.

Rate the hook on a scale of 1 to 10, where 1 is the worst and 10 is the best.

Provide feedback on the hook, including its strengths and weaknesses.

Suggest how to improve the hook to capture audience attention more effectively.

Platform: {{{platform}}}
Hook: {{{userInput}}}

Rating:
Feedback:`,
});

const analyzeAttentionHookFlow = ai.defineFlow(
  {
    name: 'analyzeAttentionHookFlow',
    inputSchema: AnalyzeAttentionHookInputSchema,
    outputSchema: AnalyzeAttentionHookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
