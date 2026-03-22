'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Info } from 'lucide-react';
import type { CornerSquareType, CornerDotType, DotsType } from './qr-customization';

interface QrCodeDisplayProps {
  value: string;
  primaryColor: string;
  backgroundColor: string;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  dotsType: DotsType;
  logoImage: string;
  /** Renders below the download buttons inside the same card (e.g. color controls). */
  footer?: ReactNode;
}

interface QRCodeStylingInstance {
  append: (element: HTMLElement) => void;
  update: (options: Record<string, unknown>) => void;
}

/** Returns true if the hex color is perceived as dark (luminance < 0.5). */
function isColorDark(hex: string): boolean {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export function QrCodeDisplay({
  value,
  primaryColor,
  backgroundColor,
  cornersSquareType,
  cornersDotType,
  dotsType,
  logoImage,
  footer,
}: QrCodeDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStylingInstance | null>(null);

  const isTransparent = backgroundColor === 'transparent';

  // Contrasting preview background so the QR is always visible on screen.
  // The actual SVG keeps bgColor transparent, so downloads have no background.
  const previewBgColor = isTransparent
    ? isColorDark(primaryColor) ? '#ffffff' : '#000000'
    : backgroundColor;

  const qrSize = 200;

  useEffect(() => {
    if (!containerRef.current) return;

    if (!value) {
      containerRef.current.innerHTML = '';
      qrInstanceRef.current = null;
      return;
    }

    const qrBgColor = isTransparent ? '#00000000' : backgroundColor;

    const options = {
      width: qrSize,
      height: qrSize,
      type: 'svg' as const,
      data: value,
      dotsOptions: { color: primaryColor, type: dotsType },
      backgroundOptions: { color: qrBgColor },
      cornersSquareOptions: { type: cornersSquareType, color: primaryColor },
      cornersDotOptions: { type: cornersDotType, color: primaryColor },
      // Raise error correction to Q when a logo covers the center modules
      qrOptions: { errorCorrectionLevel: logoImage ? 'Q' : 'M' },
      image: logoImage || undefined,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.3,
        margin: 4,
        crossOrigin: 'anonymous',
      },
    };

    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!containerRef.current) return;

      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new QRCodeStyling(options) as unknown as QRCodeStylingInstance;
        qrInstanceRef.current.append(containerRef.current);
      } else {
        qrInstanceRef.current.update(options as Record<string, unknown>);
      }
    });
  }, [value, primaryColor, backgroundColor, isTransparent, cornersSquareType, cornersDotType, dotsType, logoImage]);

  const downloadAs = (format: 'svg' | 'png') => {
    const svgElement = containerRef.current?.querySelector('svg');
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
    };

    if (format === 'svg') {
      triggerDownload(url, 'qrgen.svg');
      window.URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: true });
      const img = new Image();
      img.onload = () => {
        const out = 512;
        canvas.width = out;
        canvas.height = out;
        ctx?.drawImage(img, 0, 0, out, out);
        triggerDownload(canvas.toDataURL('image/png'), 'qrgen.png');
        window.URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-0 p-3 pb-1.5">
        <CardTitle className="text-lg">Your QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 p-3 pt-0 pb-2">
        {/* Container is always in the DOM so the qr-code-styling instance persists */}
        <div
          className="p-2 rounded-lg transition-all duration-300"
          style={{ backgroundColor: previewBgColor, display: value ? 'block' : 'none' }}
        >
          <div ref={containerRef} style={{ width: qrSize, height: qrSize }} />
        </div>

        {!value && (
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

        {isTransparent && value && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground w-full">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            Preview shows a contrasting background for visibility. The downloaded file will have a transparent background.
          </p>
        )}
      </CardContent>
      {footer ? (
        <div className="border-t border-border px-3 py-2">{footer}</div>
      ) : null}
    </Card>
  );
}
