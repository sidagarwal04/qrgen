'use client';

import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';

interface QrCodeDisplayProps {
  value: string;
  primaryColor: string;
  backgroundColor: string;
}

export function QrCodeDisplay({ value, primaryColor, backgroundColor }: QrCodeDisplayProps) {
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
            canvas.width = 256;
            canvas.height = 256;
            ctx?.drawImage(img, 0, 0, 256, 256);
            const pngUrl = canvas.toDataURL('image/png');
            triggerDownload(pngUrl, 'qrgen.png');
        };
        img.src = url;
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {value ? (
          <div
            ref={qrCodeRef}
            className="p-4 rounded-lg transition-all duration-300"
            style={{ backgroundColor }}
          >
            <QRCode
              value={value}
              bgColor={backgroundColor}
              fgColor={primaryColor}
              size={256}
              level="H"
              viewBox={`0 0 256 256`}
            />
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-muted flex items-center justify-center w-[288px] h-[288px]">
            <div className="text-center text-muted-foreground">
                <QrCode className="h-16 w-16 mx-auto mb-4" /> 
                <p>Your QR code will appear here</p>
            </div>
          </div>
        )}
        <div className="flex gap-2 w-full">
          <Button className="flex-1" onClick={() => downloadAs('png')} disabled={!value}>
            <Download className="mr-2 h-4 w-4" /> PNG
          </Button>
          <Button className="flex-1" variant="outline" onClick={() => downloadAs('svg')} disabled={!value}>
            <Download className="mr-2 h-4 w-4" /> SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
