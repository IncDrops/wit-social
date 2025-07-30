'use server';

/**
 * @fileOverview Generates a unique, shareable link for content.
 *
 * - generateShareLink - Creates a shareable link for a given piece of content.
 * - GenerateShareLinkInput - The input type for the generateShareLink function.
 * - GenerateShareLinkOutput - The return type for the generateShareLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { v4 as uuidv4 } from 'uuid';


const GenerateShareLinkInputSchema = z.object({
  content: z.string().describe('The content to be shared.'),
});
export type GenerateShareLinkInput = z.infer<typeof GenerateShareLinkInputSchema>;

const GenerateShareLinkOutputSchema = z.object({
  shareUrl: z.string().url().describe('The unique, shareable URL for the content.'),
  expiresAt: z.string().datetime().describe('The ISO 8601 timestamp for when the link expires.'),
});
export type GenerateShareLinkOutput = z.infer<typeof GenerateShareLinkOutputSchema>;

export async function generateShareLink(input: GenerateShareLinkInput): Promise<GenerateShareLinkOutput> {
  return generateShareLinkFlow(input);
}

const generateShareLinkFlow = ai.defineFlow(
  {
    name: 'generateShareLinkFlow',
    inputSchema: GenerateShareLinkInputSchema,
    outputSchema: GenerateShareLinkOutputSchema,
  },
  async (input) => {
    // In a real application, you would store the content in a database
    // associated with the generated UUID. For now, we just generate a link.
    const uniqueId = uuidv4();
    const shareUrl = `https://willittrend.com/s/${uniqueId}`;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Link expires in 24 hours

    return {
      shareUrl,
      expiresAt: expiresAt.toISOString(),
    };
  }
);
