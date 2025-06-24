import { QrCode } from "lucide-react";

export function Header() {
  return (
    <header className="py-4 px-6 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-3">
        <QrCode className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold text-primary tracking-tight">QRify</h1>
      </div>
    </header>
  );
}
