
'use server';

/**
 * @fileOverview An AI agent that discovers and saves social media trends.
 * 
 * - discoverAndSaveTrends - A function that finds new trends and saves them to Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const TrendSchema = z.object({
  title: z.string().describe('The catchy title of the trend.'),
  category: z.string().describe('The general category (e.g., Technology, Marketing, Content Creation).'),
  engagement_score: z.number().min(60).max(100).describe('An estimated virality score from 60 to 100.'),
  source: z.string().describe('The primary platforms or sources where the trend is emerging (e.g., TikTok, LinkedIn).'),
});

const TrendDiscoveryOutputSchema = z.object({
  trends: z.array(TrendSchema).describe('A list of 3-5 new and emerging trends.'),
});

const discoverTrendsPrompt = ai.definePrompt({
  name: 'discoverTrendsPrompt',
  output: { schema: TrendDiscoveryOutputSchema },
  prompt: `You are a highly skilled trend analyst for the social media intelligence platform "WillItTrend.com".

Your task is to identify 3 to 5 of the most recent and emerging trends in social media, content creation, and digital marketing. Do not include old or well-established trends. Focus on what is new and gaining velocity right now.

For each trend, provide a catchy title, a relevant category, an estimated engagement score (virality rating from 60-100), and the key platforms where it's gaining traction.

Return the list of trends.`,
});

export const discoverAndSaveTrends = ai.defineFlow(
  {
    name: 'discoverAndSaveTrends',
  },
  async () => {
    console.log('Starting trend discovery flow...');
    const { output } = await discoverTrendsPrompt();
    if (!output || !output.trends || output.trends.length === 0) {
        console.log('No trends were discovered by the AI.');
        return;
    }

    console.log(`Discovered ${output.trends.length} new trends. Saving to Firestore...`);
    const trendsCollection = db.collection('trends');
    const batch = db.batch();

    for (const trend of output.trends) {
      // Create a new document with a unique ID for each trend
      const docRef = trendsCollection.doc();
      batch.set(docRef, trend);
      console.log(`Adding trend to batch: ${trend.title}`);
    }

    try {
        await batch.commit();
        console.log('Successfully saved new trends to Firestore.');
    } catch (error) {
        console.error('Error saving trends to Firestore:', error);
        throw new Error('Failed to save trends to Firestore.');
    }
  }
);
