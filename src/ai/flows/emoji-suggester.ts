'use server';

/**
 * @fileOverview Suggests relevant emojis for a given text.
 *
 * - suggestEmojis - A function that suggests emojis.
 * - SuggestEmojisInput - The input type for the suggestEmojis function.
 * - SuggestEmojisOutput - The return type for the suggestEmojis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmojisInputSchema = z.object({
  text: z.string().describe('The text to suggest emojis for.'),
});
export type SuggestEmojisInput = z.infer<typeof SuggestEmojisInputSchema>;

const SuggestEmojisOutputSchema = z.object({
  emojis: z.array(z.string()).describe('An array of 3-5 relevant emoji characters.'),
});
export type SuggestEmojisOutput = z.infer<typeof SuggestEmojisOutputSchema>;

export async function suggestEmojis(input: SuggestEmojisInput): Promise<SuggestEmojisOutput> {
  return suggestEmojisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmojisPrompt',
  input: {schema: SuggestEmojisInputSchema},
  output: {schema: SuggestEmojisOutputSchema},
  prompt: `You are an emoji expert. Based on the following text, suggest 3 to 5 relevant emojis that would enhance it for a social media post.

Text: {{{text}}}

Return only the array of emoji characters.`,
});

const suggestEmojisFlow = ai.defineFlow(
  {
    name: 'suggestEmojisFlow',
    inputSchema: SuggestEmojisInputSchema,
    outputSchema: SuggestEmojisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
