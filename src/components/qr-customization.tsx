'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface QrCustomizationProps {
  onChange: (customization: { primaryColor?: string; backgroundColor?: string }) => void;
  currentColors: { primary: string; background: string };
}

export function QrCustomization({ onChange, currentColors }: QrCustomizationProps) {
  const isTransparent = currentColors.background === 'transparent';

  const handleTransparentToggle = (checked: boolean) => {
    onChange({ backgroundColor: checked ? 'transparent' : '#ffffff' });
  };

  return (
    <div className="space-y-2">
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
    </div>
  );
}
