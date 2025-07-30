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
import { generateHashtags } from './hashtag-generator';
import { suggestEmojis } from './emoji-suggester';

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

const hashtagGeneratorTool = ai.defineTool({
  name: 'generateHashtagsForCaption',
  description: 'Generates relevant hashtags for a given topic on a specific platform.',
  inputSchema: z.object({
    topic: z.string().describe('The topic of the caption.'),
    platform: z.string().describe('The social media platform.'),
    number: z.number().describe('The number of hashtags to generate (usually 3-5).'),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant hashtags.'),
}, async (input) => {
  const result = await generateHashtags(input);
  return result.hashtags;
});

const emojiGeneratorTool = ai.defineTool({
  name: 'suggestEmojisForCaption',
  description: 'Suggests relevant emojis to enhance a social media caption.',
  inputSchema: z.object({
    caption: z.string().describe('The caption to add emojis to.'),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant emojis.'),
}, async (input) => {
  const result = await suggestEmojis({ text: input.caption });
  return result.emojis;
});

export async function optimizeCaption(input: OptimizeCaptionInput): Promise<OptimizeCaptionOutput> {
  return optimizeCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCaptionPrompt',
  input: {schema: OptimizeCaptionInputSchema},
  output: {schema: OptimizeCaptionOutputSchema},
  tools: [hashtagGeneratorTool, emojiGeneratorTool],
  prompt: `You are a social media expert. Optimize the following caption for maximum engagement on {{platform}}.

Original Caption: "{{userInput}}"

Instructions:
- Rewrite the caption to make it more {{tone}}.
- Adhere to a character limit of {{characterLimit}} characters.
- Your final output should be a single block of text containing the optimized caption, followed by relevant emojis and hashtags.

To do this, you MUST use the provided tools. Follow this sequence:
1.  First, decide on the core topic of the original caption.
2.  Call the \`generateHashtagsForCaption\` tool with the identified topic, the target platform, and request 3-5 hashtags.
3.  Call the \`suggestEmojisForCaption\` tool with the original caption to get relevant emojis.
4.  Combine the rewritten caption, the suggested emojis, and the generated hashtags into a single, cohesive, and engaging final post. Ensure there are spaces between emojis and that hashtags are at the end.

Output only the final, improved caption with emojis and hashtags included.`,
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
