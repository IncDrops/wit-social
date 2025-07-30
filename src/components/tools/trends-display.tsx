"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockTrends } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Tags, Rss } from "lucide-react";

export function TrendsDisplay() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Real-Time Trends</h1>
        <p className="text-muted-foreground">The latest trends shaping the social media landscape.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTrends.map((trend) => (
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
        ))}
      </div>
    </div>
  );
}
