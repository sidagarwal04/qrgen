// src/ai/flows/create-qr-code-theme.ts
'use server';

/**
 * @fileOverview Generates a QR code theme based on a user-provided description.
 *
 * - createQrCodeTheme - A function that generates a QR code theme.
 * - CreateQrCodeThemeInput - The input type for the createQrCodeTheme function.
 * - CreateQrCodeThemeOutput - The return type for the createQrCodeTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateQrCodeThemeInputSchema = z.object({
  themeDescription: z
    .string()
    .describe('A description of the desired theme for the QR code.'),
});
export type CreateQrCodeThemeInput = z.infer<typeof CreateQrCodeThemeInputSchema>;

const CreateQrCodeThemeOutputSchema = z.object({
  qrCodeTheme: z.object({
    primaryColor: z.string().describe('The primary color for the QR code theme.'),
    secondaryColor: z.string().describe('The secondary color for the QR code theme.'),
    backgroundColor: z.string().describe('The background color for the QR code theme.'),
    style: z.string().describe('The style of the QR code (e.g., futuristic, minimalist).'),
  }).describe('The generated QR code theme.'),
});
export type CreateQrCodeThemeOutput = z.infer<typeof CreateQrCodeThemeOutputSchema>;

export async function createQrCodeTheme(input: CreateQrCodeThemeInput): Promise<CreateQrCodeThemeOutput> {
  return createQrCodeThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createQrCodeThemePrompt',
  input: {schema: CreateQrCodeThemeInputSchema},
  output: {schema: CreateQrCodeThemeOutputSchema},
  prompt: `You are an expert in generating color themes for QR codes.

  Based on the user's description, generate a QR code theme with appropriate colors and styles.

  Description: {{{themeDescription}}}
  `,
});

const createQrCodeThemeFlow = ai.defineFlow(
  {
    name: 'createQrCodeThemeFlow',
    inputSchema: CreateQrCodeThemeInputSchema,
    outputSchema: CreateQrCodeThemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

