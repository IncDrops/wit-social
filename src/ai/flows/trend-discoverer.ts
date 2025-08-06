
'use server';

/**
 * @fileOverview An AI agent that discovers and saves social media trends.
 * 
 * - discoverAndSaveTrends - A function that finds new trends and saves them to Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

const TrendSchema = z.object({
  title: z.string().describe('The catchy title of the trend.'),
  category: z.string().describe('The general category (e.g., Technology, Marketing, Content Creation).'),
  engagement_score: z.number().min(60).max(100).describe('An estimated virality score from 60 to 100.'),
  source: z.string().describe('The primary platforms or sources where the trend is emerging (e.g., TikTok, LinkedIn).'),
});

const TrendDiscoveryOutputSchema = z.object({
  trends: z.array(TrendSchema).describe('A list of 3-5 new and emerging trends.'),
});

const initializeFirebaseAdmin = () => {
    if (admin.apps.length > 0) {
        return;
    }
    
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
    if (!serviceAccountString) {
        throw new Error('The FIREBASE_ADMIN_SDK_CONFIG environment variable is not set. It is required for the app to connect to Firebase.');
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountString);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
        console.error('Failed to parse or initialize Firebase Admin SDK:', error);
        throw new Error('Firebase configuration is invalid.');
    }
};

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
    try {
        initializeFirebaseAdmin();
    } catch(error: any) {
        console.error("Firebase Admin initialization failed", error);
        // Re-throw the error to ensure the calling function knows about the failure.
        throw error;
    }
    
    const db = admin.firestore();

    console.log('Starting trend discovery flow...');
    const { output } = await discoverTrendsPrompt();
    if (!output || !output.trends || output.trends.length === 0) {
        console.log('No trends were discovered by the AI.');
        return { success: true, message: "No new trends discovered." };
    }

    console.log(`Discovered ${output.trends.length} new trends. Saving to Firestore...`);
    const trendsCollection = db.collection('trends');
    const batch = db.batch();

    for (const trend of output.trends) {
      const docRef = trendsCollection.doc();
      batch.set(docRef, trend);
      console.log(`Adding trend to batch: ${trend.title}`);
    }

    try {
        await batch.commit();
        const successMessage = `Successfully saved ${output.trends.length} new trends to Firestore.`;
        console.log(successMessage);
        return { success: true, message: successMessage };
    } catch (error) {
        console.error('Error saving trends to Firestore:', error);
        throw new Error('Failed to save trends to Firestore.');
    }
  }
);
