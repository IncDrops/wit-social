"use client";

import { useState } from "react";
import type { FC } from "react";
import Link from "next/link";
import {
  Bot,
  Hash,
  Lightbulb,
  Megaphone,
  Sparkles,
  TrendingUp,
  Clock,
  Menu,
  ShieldCheck,
  Share2,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { TrendsDisplay } from "@/components/tools/trends-display";
import { ViralPostGenerator } from "@/components/tools/viral-post-generator";
import { CaptionOptimizer } from "@/components/tools/caption-optimizer";
import { TrendPredictor } from "@/components/tools/trend-prediction-summary";
import { OptimalTimeToPost } from "@/components/tools/optimal-time-to-post";
import { HashtagGenerator } from "@/components/tools/hashtag-generator";
import { HookAnalyzer } from "@/components/tools/attention-hook-analyzer";
import { ContentSharer } from "@/components/tools/content-sharer";

type ToolId =
  | "trends"
  | "viral-post"
  | "caption-optimizer"
  | "trend-predictor"
  | "time-to-post"
  | "hashtag-generator"
  | "hook-analyzer"
  | "content-sharer";

interface Tool {
  id: ToolId;
  label: string;
  icon: FC<React.ComponentProps<"svg">>;
  component: FC;
}

const tools: Tool[] = [
  { id: "trends", label: "Real-Time Trends", icon: TrendingUp, component: TrendsDisplay },
  { id: "viral-post", label: "Viral Post Ideas", icon: Lightbulb, component: ViralPostGenerator },
  { id: "caption-optimizer", label: "Caption Optimizer", icon: Sparkles, component: CaptionOptimizer },
  { id: "trend-predictor", label: "Trend Predictor", icon: Bot, component: TrendPredictor },
  { id: "time-to-post", label: "Optimal Time to Post", icon: Clock, component: OptimalTimeToPost },
  { id: "hashtag-generator", label: "Hashtag Generator", icon: Hash, component: HashtagGenerator },
  { id: "hook-analyzer", label: "Attention Hook Analyzer", icon: Megaphone, component: HookAnalyzer },
  { id: "content-sharer", label: "Content Sharer", icon: Share2, component: ContentSharer },
];

const SidebarContent = ({ activeToolId, onToolClick }: { activeToolId: ToolId; onToolClick: (id: ToolId) => void }) => (
  <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
    <div className="p-4">
      <Logo />
    </div>
    <nav className="flex-1 px-4 space-y-2">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={activeToolId === tool.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onToolClick(tool.id)}
        >
          <tool.icon className="mr-3 h-5 w-5" />
          {tool.label}
        </Button>
      ))}
    </nav>
  </div>
);

export function DashboardLayout() {
  const [activeToolId, setActiveToolId] = useState<ToolId>("trends");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const ActiveToolComponent = tools.find((t) => t.id === activeToolId)?.component;

  const handleToolSelection = (id: ToolId) => {
    setActiveToolId(id);
    setIsSheetOpen(false); // Close sheet on selection
  };
  
  return (
    <div className="min-h-screen w-full flex">
      <aside className="hidden md:block w-64 border-r border-sidebar-border">
         <SidebarContent activeToolId={activeToolId} onToolClick={handleToolSelection} />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full max-w-sm">
              <SidebarContent activeToolId={activeToolId} onToolClick={handleToolSelection} />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
             <Logo />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {ActiveToolComponent ? <ActiveToolComponent /> : <div>Select a tool</div>}
          <div className="mt-12 text-center text-muted-foreground max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground">See Viral Trends Before They Blow Up—<br/>Then Ride the Wave</h2>
            <p className="mt-4 text-lg">
              WIT Social AI tracks rising trends in real-time and gives you AI-powered strategies to capitalize on them—no guessing, no sign-up.
            </p>
          </div>
        </main>

        <footer className="p-4 md:p-6 border-t border-border text-center text-xs text-muted-foreground">
            <div className="flex justify-center gap-4">
                <Link href="/terms" className="hover:text-foreground">Terms of Use</Link>
                <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/patent" className="hover:text-foreground">Patent Pending</Link>
            </div>
            <p className="mt-2">© {new Date().getFullYear()} WillItTrend.com by IncDrops LLC. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
