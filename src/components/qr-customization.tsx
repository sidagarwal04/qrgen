'use client';

import type { CheckedState } from '@radix-ui/react-checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QrCustomizationProps {
  onChange: (customization: { primaryColor?: string; backgroundColor?: string }) => void;
  currentColors: { primary: string; background: string };
}

export function QrCustomization({ onChange, currentColors }: QrCustomizationProps) {
  const isTransparent = currentColors.background === 'transparent';

  const handleTransparentToggle = (checked: CheckedState) => {
    if (checked) {
      onChange({ backgroundColor: 'transparent' });
    } else {
      // Revert to white when unchecked.
      onChange({ backgroundColor: '#ffffff' });
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold">Colors</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <Input
                id="primaryColor"
                type="color"
                value={currentColors.primary}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="p-1 h-10"
              />
            </div>
            <div>
              <Label htmlFor="backgroundColor">Background</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={isTransparent ? '#ffffff' : currentColors.background}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="p-1 h-10"
                disabled={isTransparent}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="transparent-bg"
              checked={isTransparent}
              onCheckedChange={handleTransparentToggle}
            />
            <Label
              htmlFor="transparent-bg"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Transparent Background
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
