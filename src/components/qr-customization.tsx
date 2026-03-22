'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export type CornerSquareType = 'square' | 'extra-rounded' | 'dot';
export type CornerDotType = 'square' | 'dot';

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

interface QrCustomizationProps {
  onChange: (customization: {
    primaryColor?: string;
    backgroundColor?: string;
    cornersSquareType?: CornerSquareType;
    cornersDotType?: CornerDotType;
  }) => void;
  currentColors: { primary: string; background: string };
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
}

export function QrCustomization({ onChange, currentColors, cornersSquareType, cornersDotType }: QrCustomizationProps) {
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
