'use client';

import { useRef, type ReactNode } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';

interface QrCodeDisplayProps {
  value: string;
  primaryColor: string;
  backgroundColor: string;
  /** Renders below the download buttons inside the same card (e.g. color controls). */
  footer?: ReactNode;
}

export function QrCodeDisplay({ value, primaryColor, backgroundColor, footer }: QrCodeDisplayProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const downloadAs = (format: 'svg' | 'png') => {
    const svgElement = qrCodeRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob);
    
    const triggerDownload = (href: string, fileName: string) => {
        const a = document.createElement('a');
        a.href = href;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(href);
    }

    if (format === 'svg') {
      triggerDownload(url, 'qrgen.svg');
    } else if (format === 'png') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            const out = 256;
            canvas.width = out;
            canvas.height = out;
            ctx?.drawImage(img, 0, 0, out, out);
            const pngUrl = canvas.toDataURL('image/png');
            triggerDownload(pngUrl, 'qrgen.png');
        };
        img.src = url;
    }
  };


  const qrSize = 200;

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-0 p-3 pb-1.5">
        <CardTitle className="text-lg">Your QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 p-3 pt-0 pb-2">
        {value ? (
          <div
            ref={qrCodeRef}
            className="p-2 rounded-lg transition-all duration-300"
            style={{ backgroundColor }}
          >
            <QRCode
              value={value}
              bgColor={backgroundColor}
              fgColor={primaryColor}
              size={qrSize}
              level="H"
              viewBox={`0 0 ${qrSize} ${qrSize}`}
            />
          </div>
        ) : (
          <div
            className="p-2 rounded-lg bg-muted flex items-center justify-center"
            style={{ width: qrSize + 16, height: qrSize + 16 }}
          >
            <div className="text-center text-muted-foreground text-sm">
                <QrCode className="h-12 w-12 mx-auto mb-2" /> 
                <p>Your QR code will appear here</p>
            </div>
          </div>
        )}
        <div className="flex w-full gap-2">
          <Button className="flex-1" onClick={() => downloadAs('png')} disabled={!value}>
            <Download className="mr-2 h-4 w-4" /> PNG
          </Button>
          <Button className="flex-1" variant="outline" onClick={() => downloadAs('svg')} disabled={!value}>
            <Download className="mr-2 h-4 w-4" /> SVG
          </Button>
        </div>
      </CardContent>
      {footer ? (
        <div className="border-t border-border px-3 py-2">{footer}</div>
      ) : null}
    </Card>
  );
}
