
/**
 * @fileOverview This file defines the Cloud Functions for the application, including the scheduled trend discovery job.
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { discoverAndSaveTrends } from './ai/flows/trend-discoverer';
import { logger } from 'firebase-functions';

// This is a placeholder for Next.js server that is deployed by default
export { server } from '.next/server';

/**
 * A scheduled function that runs every 24 hours to discover and save new social media trends.
 * This function invokes the `discoverAndSaveTrends` Genkit flow.
 */
export const scheduledTrendDiscovery = onSchedule('every 24 hours', async (event) => {
  logger.info('Scheduled trend discovery function triggered.');
  try {
    await discoverAndSaveTrends();
    logger.info('Trend discovery flow completed successfully.');
  } catch (error) {
    logger.error('Error running scheduled trend discovery:', error);
  }
});
