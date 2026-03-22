import { QrCode } from "lucide-react";

export function Header() {
  return (
    <header className="shrink-0 py-2 px-3 md:px-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-2">
        <QrCode className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-primary tracking-tight">QRgen</h1>
        <p className="ml-auto text-sm text-muted-foreground">
          Built with ❤️ by{' '}
          <a
            href="https://meetsid.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Sid
          </a>
          {' · Happy scanning'}
        </p>
      </div>
    </header>
  );
}
