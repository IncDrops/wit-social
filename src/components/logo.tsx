import { LineChart } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <LineChart className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold text-foreground">WIT Social AI</h1>
    </div>
  );
}
