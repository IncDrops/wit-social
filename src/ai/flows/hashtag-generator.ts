// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates relevant hashtags for social media posts, including high-volume, niche, and branded options.
 *
 * - generateHashtags - A function that generates hashtags for a given topic and platform.
 * - GenerateHashtagsInput - The input type for the generateHashtags function.
 * - GenerateHashtagsOutput - The return type for the generateHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate hashtags.'),
  platform: z.string().describe('The social media platform (e.g., TikTok, Instagram, LinkedIn).'),
  number: z.number().describe('The number of hashtags to generate.'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of generated hashtags.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}

const generateHashtagsPrompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: {schema: GenerateHashtagsInputSchema},
  output: {schema: GenerateHashtagsOutputSchema},
  prompt: `Suggest {{number}} hashtags for {{topic}} on {{platform}}.\nMix:\n- High-volume (1M+ posts)\n- Niche (50K-1M posts)\n- Branded (Custom)\n\nExample Output:\nFitness: #FitTok (3M) #GymMotivation (1.2M) #YourBrandName`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async input => {
    const {output} = await generateHashtagsPrompt(input);
    return output!;
  }
);
