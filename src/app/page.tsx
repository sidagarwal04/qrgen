import { Header } from '@/components/layout/header';
import { QrCodeGenerator } from '@/components/qr-code-generator';

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1 px-2 py-1.5 md:px-4 md:py-2">
        <QrCodeGenerator />
      </main>
    </div>
  );
}
