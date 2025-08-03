
import { NextResponse } from 'next/server';
import { discoverAndSaveTrends } from '@/ai/flows/trend-discoverer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    const result = await discoverAndSaveTrends();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
