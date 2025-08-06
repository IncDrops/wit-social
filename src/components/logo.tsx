import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="WIT Social AI Logo" width={28} height={28} className="h-7 w-7" />
      <h1 className="text-xl font-bold text-foreground">WIT Social AI</h1>
    </div>
  );
}
