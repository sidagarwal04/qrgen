'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Info } from 'lucide-react';
import type { CornerSquareType, CornerDotType, DotsType, FrameType } from './qr-customization';

interface QrCodeDisplayProps {
  value: string;
  primaryColor: string;
  backgroundColor: string;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  dotsType: DotsType;
  logoImage: string;
  frameType: FrameType;
  frameLabel: string;
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

// ─── Frame geometry (at 200px QR size) ────────────────────────────────────────
const F = { pad: 16, textH: 40, borderW: 4, borderR: 12 } as const;

function frameHasText(f: FrameType) {
  return f === 'label-bottom' || f === 'banner-bottom' || f === 'label-top';
}

function getFrameGeometry(frameType: FrameType, qrSize: number) {
  const { pad, textH } = F;
  const hasBorder = frameType !== 'none';
  const p = hasBorder ? pad : 8;
  let totalW = qrSize + p * 2;
  let totalH = qrSize + p * 2;
  let qrX = p;
  let qrY = p;
  if (frameType === 'label-top') { totalH += textH; qrY += textH; }
  else if (frameType === 'label-bottom' || frameType === 'banner-bottom') { totalH += textH; }
  return { totalW, totalH, qrX, qrY, p };
}

// ─── SVG frame builder (for SVG download) ─────────────────────────────────────
function buildFramedSvg(
  qrSvgEl: Element,
  frameType: FrameType,
  frameLabel: string,
  qrSize: number,
  primaryColor: string,
  bgColor: string,
): string {
  if (frameType === 'none') return new XMLSerializer().serializeToString(qrSvgEl);

  const ns = 'http://www.w3.org/2000/svg';
  const { totalW, totalH, qrX, qrY } = getFrameGeometry(frameType, qrSize);
  const { borderW, borderR, textH } = F;
  const isTransparent = bgColor === '#00000000' || bgColor === 'transparent';

  const outer = document.createElementNS(ns, 'svg') as SVGSVGElement;
  outer.setAttribute('xmlns', ns);
  outer.setAttribute('width', String(totalW));
  outer.setAttribute('height', String(totalH));
  outer.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);

  const el = (tag: string, attrs: Record<string, string>) => {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  };

  // Background
  if (!isTransparent) {
    outer.appendChild(el('rect', {
      width: String(totalW), height: String(totalH),
      fill: bgColor, rx: String(borderR),
    }));
  }

  // Border
  outer.appendChild(el('rect', {
    x: String(borderW / 2), y: String(borderW / 2),
    width: String(totalW - borderW), height: String(totalH - borderW),
    fill: 'none', stroke: primaryColor,
    'stroke-width': String(borderW), rx: String(borderR - borderW / 2),
  }));

  // Nested QR SVG
  const inner = qrSvgEl.cloneNode(true) as SVGElement;
  inner.setAttribute('x', String(qrX));
  inner.setAttribute('y', String(qrY));
  inner.setAttribute('width', String(qrSize));
  inner.setAttribute('height', String(qrSize));
  outer.appendChild(inner);

  const label = (frameLabel || 'SCAN ME').toUpperCase();
  const textAttrs = {
    'text-anchor': 'middle', 'dominant-baseline': 'middle',
    'font-family': 'Arial, Helvetica, sans-serif',
    'font-size': '18', 'font-weight': 'bold', 'letter-spacing': '2',
  };

  if (frameType === 'label-top') {
    outer.appendChild(Object.assign(el('text', { ...textAttrs, fill: primaryColor,
      x: String(totalW / 2), y: String(qrY / 2) }), { textContent: label }));
  } else if (frameType === 'label-bottom') {
    outer.appendChild(Object.assign(el('text', { ...textAttrs, fill: primaryColor,
      x: String(totalW / 2), y: String(qrY + qrSize + textH / 2) }), { textContent: label }));
  } else if (frameType === 'banner-bottom') {
    outer.appendChild(el('rect', {
      x: String(borderW), y: String(qrY + qrSize),
      width: String(totalW - borderW * 2), height: String(textH),
      fill: primaryColor, rx: String(Math.max(0, borderR - borderW - 1)),
    }));
    const bannerTextColor = isTransparent ? '#ffffff' : (isColorDark(primaryColor) ? '#ffffff' : '#000000');
    outer.appendChild(Object.assign(el('text', { ...textAttrs, fill: bannerTextColor,
      x: String(totalW / 2), y: String(qrY + qrSize + textH / 2) }), { textContent: label }));
  }

  return new XMLSerializer().serializeToString(outer);
}

// ─── Canvas rounded-rect helper ───────────────────────────────────────────────
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ─── Framed PNG canvas builder ────────────────────────────────────────────────
function buildFramedCanvas(
  qrImg: HTMLImageElement,
  frameType: FrameType,
  frameLabel: string,
  outQrSize: number,
  primaryColor: string,
  bgColor: string,
  isTransparent: boolean,
): HTMLCanvasElement {
  const scale = outQrSize / 200;
  const pad    = F.pad    * scale;
  const textH  = F.textH  * scale;
  const borderW = F.borderW * scale;
  const borderR = F.borderR * scale;

  const { totalW, totalH, qrX, qrY } = (() => {
    const g = getFrameGeometry(frameType, 200);
    return {
      totalW: g.totalW * scale, totalH: g.totalH * scale,
      qrX: g.qrX * scale, qrY: g.qrY * scale,
    };
  })();
  void pad; // used via scale above

  const canvas = document.createElement('canvas');
  canvas.width  = Math.round(totalW);
  canvas.height = Math.round(totalH);
  const ctx = canvas.getContext('2d', { alpha: true })!;

  // Background
  if (!isTransparent) {
    ctx.fillStyle = bgColor;
    rrect(ctx, 0, 0, totalW, totalH, borderR);
    ctx.fill();
  }

  // QR code image
  ctx.drawImage(qrImg, qrX, qrY, outQrSize, outQrSize);

  // Border
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = borderW;
  rrect(ctx, borderW / 2, borderW / 2, totalW - borderW, totalH - borderW, borderR - borderW / 2);
  ctx.stroke();

  // Text labels
  const fontSize = Math.round(18 * scale);
  ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = (frameLabel || 'SCAN ME').toUpperCase();

  if (frameType === 'label-top') {
    ctx.fillStyle = primaryColor;
    ctx.fillText(label, totalW / 2, qrY / 2);
  } else if (frameType === 'label-bottom') {
    ctx.fillStyle = primaryColor;
    ctx.fillText(label, totalW / 2, qrY + outQrSize + textH / 2);
  } else if (frameType === 'banner-bottom') {
    ctx.fillStyle = primaryColor;
    rrect(ctx, borderW, qrY + outQrSize, totalW - borderW * 2, textH, Math.max(0, borderR - borderW - 1));
    ctx.fill();
    ctx.fillStyle = isTransparent ? '#ffffff' : (isColorDark(primaryColor) ? '#ffffff' : '#000000');
    ctx.fillText(label, totalW / 2, qrY + outQrSize + textH / 2);
  }

  return canvas;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function QrCodeDisplay({
  value,
  primaryColor,
  backgroundColor,
  cornersSquareType,
  cornersDotType,
  dotsType,
  logoImage,
  frameType,
  frameLabel,
  footer,
}: QrCodeDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStylingInstance | null>(null);

  const isTransparent = backgroundColor === 'transparent';
  const previewBgColor = isTransparent
    ? (isColorDark(primaryColor) ? '#ffffff' : '#000000')
    : backgroundColor;

  const qrSize = 200;
  const hasFrame = frameType !== 'none';
  const hasBanner = frameType === 'banner-bottom';
  const hasLabelBottom = frameType === 'label-bottom';
  const hasLabelTop = frameType === 'label-top';
  const label = (frameLabel || 'SCAN ME').toUpperCase();
  const bannerTextColor = isColorDark(primaryColor) ? '#ffffff' : '#000000';

  useEffect(() => {
    if (!containerRef.current) return;

    if (!value) {
      containerRef.current.innerHTML = '';
      qrInstanceRef.current = null;
      return;
    }

    const qrBgColor = isTransparent ? '#00000000' : backgroundColor;
    const options = {
      width: qrSize, height: qrSize, type: 'svg' as const,
      data: value,
      dotsOptions: { color: primaryColor, type: dotsType },
      backgroundOptions: { color: qrBgColor },
      cornersSquareOptions: { type: cornersSquareType, color: primaryColor },
      cornersDotOptions: { type: cornersDotType, color: primaryColor },
      qrOptions: { errorCorrectionLevel: logoImage ? 'Q' : 'M' },
      image: logoImage || undefined,
      imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 4, crossOrigin: 'anonymous' },
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

    const qrSvgString = new XMLSerializer().serializeToString(svgElement);
    const qrBgColor = isTransparent ? '#00000000' : backgroundColor;

    const triggerDownload = (href: string, name: string) => {
      const a = document.createElement('a');
      a.href = href; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    if (format === 'svg') {
      const svgOutput = buildFramedSvg(svgElement, frameType, frameLabel, qrSize, primaryColor, qrBgColor);
      const url = URL.createObjectURL(new Blob([svgOutput], { type: 'image/svg+xml' }));
      triggerDownload(url, 'qrgen.svg');
      URL.revokeObjectURL(url);
    } else {
      const svgUrl = URL.createObjectURL(new Blob([qrSvgString], { type: 'image/svg+xml' }));
      const img = new Image();
      img.onload = () => {
        const out = 512;
        let canvas: HTMLCanvasElement;
        if (frameType === 'none') {
          canvas = document.createElement('canvas');
          canvas.width = out; canvas.height = out;
          canvas.getContext('2d', { alpha: true })?.drawImage(img, 0, 0, out, out);
        } else {
          canvas = buildFramedCanvas(img, frameType, frameLabel, out, primaryColor, qrBgColor, isTransparent);
        }
        triggerDownload(canvas.toDataURL('image/png'), 'qrgen.png');
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-0 p-3 pb-1.5">
        <CardTitle className="text-lg">Your QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 p-3 pt-0 pb-2">

        {/* QR + frame preview — always in DOM (CSS display:none keeps the ref alive) */}
        <div style={{ display: value ? 'flex' : 'none', flexDirection: 'column', alignItems: 'stretch' }}>
          <div
            style={{
              backgroundColor: previewBgColor,
              borderRadius: hasFrame ? F.borderR : 8,
              border: hasFrame ? `${F.borderW}px solid ${primaryColor}` : 'none',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            {hasLabelTop && (
              <div style={{
                padding: '6px 12px', textAlign: 'center',
                fontWeight: 800, letterSpacing: '0.12em', fontSize: 11,
                color: primaryColor,
              }}>
                {label}
              </div>
            )}
            <div style={{ padding: hasFrame ? F.pad / 2 : 8 }}>
              <div ref={containerRef} style={{ width: qrSize, height: qrSize }} />
            </div>
            {hasLabelBottom && (
              <div style={{
                padding: '6px 12px', textAlign: 'center',
                fontWeight: 800, letterSpacing: '0.12em', fontSize: 11,
                color: primaryColor,
              }}>
                {label}
              </div>
            )}
            {hasBanner && (
              <div style={{
                padding: '8px 12px', textAlign: 'center',
                fontWeight: 800, letterSpacing: '0.12em', fontSize: 11,
                backgroundColor: primaryColor, color: bannerTextColor,
              }}>
                {label}
              </div>
            )}
          </div>
        </div>

        {/* Placeholder when no QR value yet */}
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
