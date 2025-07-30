'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating viral post ideas.
 *
 * - generateViralPostIdeas - A function that generates viral post ideas based on topic, platform, and tone.
 * - ViralPostIdeasInput - The input type for the generateViralPostIdeas function.
 * - ViralPostIdeasOutput - The return type for the generateViralPostIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ViralPostIdeasInputSchema = z.object({
  number: z
    .number()
    .describe('The number of viral post ideas to generate.'),
  platform: z.string().describe('The social media platform (e.g., TikTok, Instagram, LinkedIn).'),
  topic: z.string().describe('The topic of the posts.'),
  tone: z.string().describe('The tone of the posts (e.g., casual, professional, humorous).'),
});
export type ViralPostIdeasInput = z.infer<typeof ViralPostIdeasInputSchema>;

const ViralPostIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of viral post ideas.'),
});
export type ViralPostIdeasOutput = z.infer<typeof ViralPostIdeasOutputSchema>;

export async function generateViralPostIdeas(input: ViralPostIdeasInput): Promise<ViralPostIdeasOutput> {
  return viralPostIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'viralPostIdeasPrompt',
  input: {schema: ViralPostIdeasInputSchema},
  output: {schema: ViralPostIdeasOutputSchema},
  prompt: `You are a social media expert. Generate {{number}} ideas for {{platform}} posts about {{topic}}.
- Tone: {{tone}}
- Format: {Reel/Story/Carousel}
- Include: {hook, main message, call-to-action}
Example Output:
1. "🔥 3 Secrets {Industry} Won’t Tell You!" (Hook) + (Text: "Here’s what they hide...") + (CTA: "Follow for more!")
2. "Day in the Life of a {Role}" (Hook) + (Text: "Spoiler: It’s not what you think!") + (CTA: "Comment your thoughts!")`,
});

const viralPostIdeasFlow = ai.defineFlow(
  {
    name: 'viralPostIdeasFlow',
    inputSchema: ViralPostIdeasInputSchema,
    outputSchema: ViralPostIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
