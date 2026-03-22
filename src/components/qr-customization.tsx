'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export type CornerSquareType = 'square' | 'extra-rounded' | 'dot';
export type CornerDotType = 'square' | 'dot';
export type DotsType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type FrameType = 'none' | 'simple' | 'label-bottom' | 'banner-bottom' | 'label-top';

export interface CornerPreset {
  id: string;
  cornersSquare: CornerSquareType;
  cornersDot: CornerDotType;
  label: string;
}

export const CORNER_PRESETS: CornerPreset[] = [
  { id: 'sq-sq',    cornersSquare: 'square',        cornersDot: 'square', label: 'Square' },
  { id: 'sq-dot',   cornersSquare: 'square',        cornersDot: 'dot',    label: 'Square / Dot' },
  { id: 'rnd-sq',   cornersSquare: 'extra-rounded', cornersDot: 'square', label: 'Rounded / Square' },
  { id: 'rnd-dot',  cornersSquare: 'extra-rounded', cornersDot: 'dot',    label: 'Rounded / Dot' },
  { id: 'dot-sq',   cornersSquare: 'dot',           cornersDot: 'square', label: 'Circle / Square' },
  { id: 'dot-dot',  cornersSquare: 'dot',           cornersDot: 'dot',    label: 'Circle / Dot' },
];

// SVG icons representing each finder-pattern corner style
function CornerIcon({ cornersSquare, cornersDot }: { cornersSquare: CornerSquareType; cornersDot: CornerDotType }) {
  const isCircleOuter = cornersSquare === 'dot';
  const isRoundedOuter = cornersSquare === 'extra-rounded';
  const isCircleInner = cornersDot === 'dot';

  const outerRx = isCircleOuter ? '9' : isRoundedOuter ? '4.5' : '0';
  const holeRx  = isCircleOuter ? '6' : isRoundedOuter ? '2.5' : '0';
  const innerRx = isCircleInner ? '3' : '0';

  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
      {/* Outer shape (filled) */}
      {isCircleOuter ? (
        <circle cx="10" cy="10" r="9" fill="currentColor" />
      ) : (
        <rect x="1" y="1" width="18" height="18" rx={outerRx} fill="currentColor" />
      )}
      {/* White cutout (ring gap) */}
      {isCircleOuter ? (
        <circle cx="10" cy="10" r="6" fill="white" />
      ) : (
        <rect x="4" y="4" width="12" height="12" rx={holeRx} fill="white" />
      )}
      {/* Inner dot */}
      <rect x="7" y="7" width="6" height="6" rx={innerRx} fill="currentColor" />
    </svg>
  );
}

// ─── Pattern (dots) styles ────────────────────────────────────────────────────

export interface PatternPreset {
  id: DotsType;
  label: string;
}

export const PATTERN_PRESETS: PatternPreset[] = [
  { id: 'square',        label: 'Square' },
  { id: 'rounded',       label: 'Rounded' },
  { id: 'dots',          label: 'Dots' },
  { id: 'extra-rounded', label: 'Extra Rounded' },
  { id: 'classy',        label: 'Classy' },
  { id: 'classy-rounded', label: 'Classy Rounded' },
];

// Sparse 3×3 grid positions — gives a QR-like feel with larger, shape-distinguishable dots.
// cellSize = 20/3 ≈ 6.67px  →  dot r = 2.5 (75% fill, big enough to see shape differences)
const PATTERN_DOT_POSITIONS: [number, number][] = [
  [0, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [1, 2], [2, 2],
];
const CELL = 20 / 3;

function renderPatternDot(cx: number, cy: number, type: DotsType, key: number) {
  const r = 2.5;

  switch (type) {
    case 'dots':
      // Perfect circle — unmistakably round
      return <circle key={key} cx={cx} cy={cy} r={r} fill="currentColor" />;

    case 'rounded':
      // Square with clearly visible rounded corners (40% radius)
      return <rect key={key} x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={r * 0.4} fill="currentColor" />;

    case 'extra-rounded': {
      // Squircle via cubic Bézier (k≈0.85 vs 0.552 for a circle).
      // Has visibly flat sides — clearly different from both dots and rounded.
      const k = 0.85;
      const d = [
        `M ${cx},${cy - r}`,
        `C ${cx + r * k},${cy - r} ${cx + r},${cy - r * k} ${cx + r},${cy}`,
        `C ${cx + r},${cy + r * k} ${cx + r * k},${cy + r} ${cx},${cy + r}`,
        `C ${cx - r * k},${cy + r} ${cx - r},${cy + r * k} ${cx - r},${cy}`,
        `C ${cx - r},${cy - r * k} ${cx - r * k},${cy - r} ${cx},${cy - r} Z`,
      ].join(' ');
      return <path key={key} d={d} fill="currentColor" />;
    }

    case 'classy': {
      // Sharp diamond — rotated square, no rounded corners
      const cr = 2.0; // smaller so diagonals don't overlap neighbouring cells
      return (
        <rect key={key} x={cx - cr} y={cy - cr} width={cr * 2} height={cr * 2}
          rx={0} transform={`rotate(45,${cx},${cy})`} fill="currentColor" />
      );
    }

    case 'classy-rounded': {
      // Rounded diamond — same diamond but with clearly visible corner rounding
      const cr = 2.0;
      return (
        <rect key={key} x={cx - cr} y={cy - cr} width={cr * 2} height={cr * 2}
          rx={cr * 0.5} transform={`rotate(45,${cx},${cy})`} fill="currentColor" />
      );
    }

    default: // 'square'
      // Crisp square, no rounding at all
      return <rect key={key} x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={0} fill="currentColor" />;
  }
}

function PatternIcon({ type }: { type: DotsType }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
      {PATTERN_DOT_POSITIONS.map(([col, row], i) =>
        renderPatternDot(col * CELL + CELL / 2, row * CELL + CELL / 2, type, i),
      )}
    </svg>
  );
}

// ─── Frame styles ─────────────────────────────────────────────────────────────

export const FRAME_PRESETS: { id: FrameType; label: string }[] = [
  { id: 'none',          label: 'No frame' },
  { id: 'simple',        label: 'Simple border' },
  { id: 'label-bottom',  label: 'Label below' },
  { id: 'banner-bottom', label: 'Banner below' },
  { id: 'label-top',     label: 'Label above' },
];

function FrameIcon({ type }: { type: FrameType }) {
  // Shared: light fill representing the QR area
  const qrArea = <rect x="4.5" y="3" width="11" height="9" fill="currentColor" fillOpacity="0.2" rx="1" />;

  switch (type) {
    case 'none':
      return (
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'simple':
      return (
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.8" rx="2" />
          <rect x="5" y="5" width="10" height="10" fill="currentColor" fillOpacity="0.2" rx="1" />
        </svg>
      );
    case 'label-bottom':
      return (
        // Text sits BELOW the border with a visible gap
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <rect x="1.5" y="1" width="17" height="12" stroke="currentColor" strokeWidth="1.8" rx="2" />
          <rect x="4.5" y="3" width="11" height="8" fill="currentColor" fillOpacity="0.2" rx="1" />
          <text x="10" y="17" textAnchor="middle" fontSize="3.8" fill="currentColor"
            fontFamily="sans-serif" fontWeight="bold" dominantBaseline="middle">SCAN ME</text>
        </svg>
      );
    case 'banner-bottom':
      return (
        // Thin divider line separates the QR area from the filled banner
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <rect x="1.5" y="1" width="17" height="18" stroke="currentColor" strokeWidth="1.8" rx="2" />
          <rect x="4.5" y="3" width="11" height="8" fill="currentColor" fillOpacity="0.2" rx="1" />
          <line x1="1.5" y1="12.5" x2="18.5" y2="12.5" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" />
          <rect x="2.2" y="13" width="15.6" height="5.3" fill="currentColor" rx="1.2" />
          <text x="10" y="15.5" textAnchor="middle" fontSize="3.5" fill="white"
            fontFamily="sans-serif" fontWeight="bold" dominantBaseline="middle">SCAN ME</text>
        </svg>
      );
    case 'label-top':
      return (
        // Text sits ABOVE the border with a visible gap
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <text x="10" y="3" textAnchor="middle" fontSize="3.8" fill="currentColor"
            fontFamily="sans-serif" fontWeight="bold" dominantBaseline="middle">SCAN ME</text>
          <rect x="1.5" y="6.5" width="17" height="12.5" stroke="currentColor" strokeWidth="1.8" rx="2" />
          <rect x="4.5" y="8.5" width="11" height="8.5" fill="currentColor" fillOpacity="0.2" rx="1" />
        </svg>
      );
  }
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface QrCustomizationProps {
  onChange: (customization: {
    primaryColor?: string;
    backgroundColor?: string;
    cornersSquareType?: CornerSquareType;
    cornersDotType?: CornerDotType;
    dotsType?: DotsType;
    frameType?: FrameType;
    frameLabel?: string;
  }) => void;
  currentColors: { primary: string; background: string };
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  dotsType: DotsType;
  frameType: FrameType;
  frameLabel: string;
}

export function QrCustomization({ onChange, currentColors, cornersSquareType, cornersDotType, dotsType, frameType, frameLabel }: QrCustomizationProps) {
  const isTransparent = currentColors.background === 'transparent';

  const selectedPresetId = CORNER_PRESETS.find(
    (p) => p.cornersSquare === cornersSquareType && p.cornersDot === cornersDotType,
  )?.id ?? 'sq-sq';

  const handleTransparentToggle = (checked: boolean) => {
    onChange({ backgroundColor: checked ? 'transparent' : '#ffffff' });
  };

  return (
    <div className="space-y-2">
      {/* Colors */}
      <p className="text-sm font-semibold leading-none">Colors</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="primaryColor" className="text-xs">
            Primary
          </Label>
          <Input
            id="primaryColor"
            type="color"
            value={currentColors.primary}
            onChange={(e) => onChange({ primaryColor: e.target.value })}
            className="h-9 cursor-pointer p-1"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="backgroundColor" className="text-xs">
            Background
          </Label>
          <Input
            id="backgroundColor"
            type="color"
            value={isTransparent ? '#ffffff' : currentColors.background}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="h-9 cursor-pointer p-1"
            disabled={isTransparent}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="transparent-bg"
          checked={isTransparent}
          onCheckedChange={handleTransparentToggle}
        />
        <Label htmlFor="transparent-bg" className="text-xs font-medium cursor-pointer">
          Transparent background
        </Label>
      </div>

      {/* Pattern (dot) styles */}
      <p className="text-sm font-semibold leading-none pt-1">Patterns</p>
      <div className="grid grid-cols-6 gap-1.5">
        {PATTERN_PRESETS.map((preset) => {
          const isSelected = preset.id === dotsType;
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              onClick={() => onChange({ dotsType: preset.id })}
              className={cn(
                'flex items-center justify-center rounded-lg border-2 p-1.5 transition-colors',
                'hover:border-primary/60 hover:bg-primary/5',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground',
              )}
              style={{ aspectRatio: '1' }}
            >
              <PatternIcon type={preset.id} />
            </button>
          );
        })}
      </div>

      {/* Frame */}
      <p className="text-sm font-semibold leading-none pt-1">Frame</p>
      <div className="grid grid-cols-6 gap-1.5">
        {FRAME_PRESETS.map((preset) => {
          const isSelected = preset.id === frameType;
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              onClick={() => onChange({ frameType: preset.id })}
              className={cn(
                'flex items-center justify-center rounded-lg border-2 p-1.5 transition-colors',
                'hover:border-primary/60 hover:bg-primary/5',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground',
              )}
              style={{ aspectRatio: '1' }}
            >
              <FrameIcon type={preset.id} />
            </button>
          );
        })}
      </div>
      {frameType !== 'none' && frameType !== 'simple' && (
        <Input
          value={frameLabel}
          onChange={(e) => onChange({ frameLabel: e.target.value })}
          placeholder="SCAN ME"
          maxLength={24}
          className="h-8 text-xs tracking-widest uppercase"
        />
      )}

      {/* Corner styles */}
      <p className="text-sm font-semibold leading-none pt-1">Corners</p>
      <div className="grid grid-cols-6 gap-1.5">
        {CORNER_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              onClick={() =>
                onChange({ cornersSquareType: preset.cornersSquare, cornersDotType: preset.cornersDot })
              }
              className={cn(
                'flex items-center justify-center rounded-lg border-2 p-1.5 transition-colors',
                'hover:border-primary/60 hover:bg-primary/5',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground',
              )}
              style={{ aspectRatio: '1' }}
            >
              <CornerIcon cornersSquare={preset.cornersSquare} cornersDot={preset.cornersDot} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
