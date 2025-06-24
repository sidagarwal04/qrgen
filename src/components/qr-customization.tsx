'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createQrCodeTheme } from '@/ai/flows/create-qr-code-theme';
import { Wand2 } from 'lucide-react';

interface QrCustomizationProps {
  onChange: (customization: { primaryColor?: string; backgroundColor?: string }) => void;
  currentColors: { primary: string; background: string };
}

export function QrCustomization({ onChange, currentColors }: QrCustomizationProps) {
  const [themeDescription, setThemeDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateTheme = async () => {
    if (!themeDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a theme description.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await createQrCodeTheme({ themeDescription });
      if (result?.qrCodeTheme) {
        onChange({
          primaryColor: result.qrCodeTheme.primaryColor,
          backgroundColor: result.qrCodeTheme.backgroundColor,
        });
        toast({
          title: 'Theme Generated!',
          description: `Applied a ${result.qrCodeTheme.style} theme.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate theme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
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
                value={currentColors.background}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="p-1 h-10"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold">AI Theme Creator</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
            <Label htmlFor="themeDescription">Theme Description</Label>
            <Textarea
                id="themeDescription"
                placeholder="e.g., 'a futuristic theme with neon blue and dark gray'"
                value={themeDescription}
                onChange={(e) => setThemeDescription(e.target.value)}
            />
            <Button onClick={handleGenerateTheme} disabled={isGenerating} className="w-full">
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
