import { Header } from '@/components/layout/header';
import { QrCodeGenerator } from '@/components/qr-code-generator';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      <Header />
      <main className="p-4 md:p-8">
        <QrCodeGenerator />
      </main>
      <Footer />
    </div>
  );
}
