'use server';

/**
 * @fileOverview Optimizes social media captions to increase engagement.
 *
 * - optimizeCaption - A function that optimizes a user-provided social media caption.
 * - OptimizeCaptionInput - The input type for the optimizeCaption function.
 * - OptimizeCaptionOutput - The return type for the optimizeCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCaptionInputSchema = z.object({
  platform: z
    .string()
    .describe('The social media platform (e.g., TikTok, Instagram, LinkedIn).'),
  userInput: z.string().describe('The user-provided caption to optimize.'),
  tone: z.enum(['shorter', 'wittier', 'emotional']).describe('The desired tone for the optimized caption.'),
  characterLimit: z.number().describe('The character limit for the optimized caption.'),
});
export type OptimizeCaptionInput = z.infer<typeof OptimizeCaptionInputSchema>;

const OptimizeCaptionOutputSchema = z.object({
  optimizedCaption: z.string().describe('The optimized social media caption.'),
});
export type OptimizeCaptionOutput = z.infer<typeof OptimizeCaptionOutputSchema>;

const hashtagGenerator = ai.defineTool({
  name: 'generateHashtags',
  description: 'Generates relevant hashtags for a given topic on a specific platform.',
  inputSchema: z.object({
    topic: z.string().describe('The topic of the caption.'),
    platform: z.string().describe('The social media platform.'),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant hashtags.'),
}, async (input) => {
  // Placeholder implementation for hashtag generation.
  // In a real application, this would call an external API or service.
  return [`#${input.topic.replace(/ /g, '')}`, `#${input.platform}`, '#viral']
});

const emojiGenerator = ai.defineTool({
  name: 'suggestEmojis',
  description: 'Suggests relevant emojis to enhance a social media caption.',
  inputSchema: z.object({
    caption: z.string().describe('The caption to add emojis to.'),
    platform: z.string().describe('The social media platform.'),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant emojis.'),
}, async (input) => {
  // Placeholder implementation for emoji suggestion.
  // In a real application, this would use an LLM or an emoji API.
  return ['🚀', '🔥', '✨'];
});

export async function optimizeCaption(input: OptimizeCaptionInput): Promise<OptimizeCaptionOutput> {
  return optimizeCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCaptionPrompt',
  input: {schema: OptimizeCaptionInputSchema},
  output: {schema: OptimizeCaptionOutputSchema},
  tools: [hashtagGenerator, emojiGenerator],
  prompt: `You are a social media expert. Optimize the following caption for maximum engagement on {{platform}}.

Original Caption: "{{userInput}}"

Instructions:
- Make the caption {{tone}}.
- Adhere to a character limit of {{characterLimit}} characters.

If relevant and not already present, use the following tools to suggest hashtags and emojis to increase engagement:
- hashtagGenerator (topic: topic of the caption, platform: {{platform}})
- emojiGenerator (caption: optimized caption, platform: {{platform}})

Output the improved caption. Add relevant hashtags and emojis if missing.`,
});

const optimizeCaptionFlow = ai.defineFlow(
  {
    name: 'optimizeCaptionFlow',
    inputSchema: OptimizeCaptionInputSchema,
    outputSchema: OptimizeCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
