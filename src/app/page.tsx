import { Header } from '@/components/layout/header';
import { QrCodeGenerator } from '@/components/qr-code-generator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <QrCodeGenerator />
      </main>
    </div>
  );
}
