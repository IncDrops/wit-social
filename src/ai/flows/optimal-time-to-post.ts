'use server';
/**
 * @fileOverview Provides optimal posting times based on audience data.
 *
 * - getOptimalTimeToPost - A function that returns the best posting times.
 * - OptimalTimeToPostInput - The input type for the getOptimalTimeToPost function.
 * - OptimalTimeToPostOutput - The return type for the getOptimalTimeToPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimalTimeToPostInputSchema = z.object({
  platform: z.string().describe('The social media platform (e.g., TikTok, Instagram, LinkedIn).'),
  audienceData: z.string().describe('Audience data including peak times and timezones.'),
});
export type OptimalTimeToPostInput = z.infer<typeof OptimalTimeToPostInputSchema>;

const OptimalTimeToPostOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      timeWindow: z.string().describe('A posting time window (e.g., 9-11 AM EST).'),
      reason: z.string().describe('The reason why this time window is recommended.'),
    })
  ).describe('Top 3 posting windows with timezones and reasons.'),
});
export type OptimalTimeToPostOutput = z.infer<typeof OptimalTimeToPostOutputSchema>;

export async function getOptimalTimeToPost(input: OptimalTimeToPostInput): Promise<OptimalTimeToPostOutput> {
  return optimalTimeToPostFlow(input);
}

const optimalTimeToPostPrompt = ai.definePrompt({
  name: 'optimalTimeToPostPrompt',
  input: {schema: OptimalTimeToPostInputSchema},
  output: {schema: OptimalTimeToPostOutputSchema},
  prompt: `Given the audience data for {{platform}}:
{{audienceData}}

Recommend the top 3 posting windows (include timezone) and explain why these times work.

Example Output:
{
  "recommendations": [
    {
      "timeWindow": "9-11 AM EST",
      "reason": "Commute hours."
    },
    {
      "timeWindow": "7-9 PM EST",
      "reason": "Evening scroll time."
    }
  ]
}`,
});

const optimalTimeToPostFlow = ai.defineFlow(
  {
    name: 'optimalTimeToPostFlow',
    inputSchema: OptimalTimeToPostInputSchema,
    outputSchema: OptimalTimeToPostOutputSchema,
  },
  async input => {
    const {output} = await optimalTimeToPostPrompt(input);
    return output!;
  }
);
