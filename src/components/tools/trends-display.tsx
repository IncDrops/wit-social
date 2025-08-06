
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Tags, Rss } from "lucide-react";
import { getTrends } from "@/lib/firebase";
import { mockTrends, type Trend } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendsDisplay() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrends() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTrends = await getTrends();

        if (fetchedTrends.length > 0) {
          // If we have live trends, use them exclusively
          setTrends(fetchedTrends.sort((a, b) => b.engagement_score - a.engagement_score));
        } else {
          // Otherwise, fall back to mock data and show a notice
          setError("Displaying sample trends. Live AI-discovered trends will appear here automatically as they are found.");
          setTrends(mockTrends.sort((a, b) => b.engagement_score - a.engagement_score));
        }

      } catch (err) {
        setError("Failed to fetch live trends. Displaying sample data.");
        console.error(err);
        setTrends(mockTrends.sort((a, b) => b.engagement_score - a.engagement_score)); // Fallback to mocks on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrends();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Real-Time Trends</h1>
        <p className="text-muted-foreground">The latest trends shaping the social media landscape, updated daily by AI.</p>
      </div>

      {error && !isLoading && (
        <Card>
            <CardHeader>
                <CardTitle>Notice</CardTitle>
                <CardDescription>{error}</CardDescription>
            </CardHeader>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
             <Card key={index}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
             </Card>
          ))
        ) : (
          trends.map((trend) => (
            <Card key={trend.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{trend.title}</CardTitle>
                <CardDescription className="flex items-center pt-1">
                  <Rss className="h-4 w-4 mr-2" />
                  {trend.source}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <div className="flex items-center text-sm text-muted-foreground">
                   <Tags className="h-4 w-4 mr-2" />
                   Category: <Badge variant="outline" className="ml-2">{trend.category}</Badge>
                </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-2" />
                   Engagement Score: <span className="font-semibold text-primary ml-2">{trend.engagement_score}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
