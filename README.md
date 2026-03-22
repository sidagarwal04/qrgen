# QRgen

**Live app → [qrgen.meetsid.dev](https://qrgen.meetsid.dev)**

A modern, fully-featured QR code generator built with Next.js. Generate, style, and download QR codes for any use case — no account required.

## Features

### QR Code Types
- **URL** — website links, with a one-click "Open URL to test" shortcut
- **Text** — plain text
- **WiFi** — network credentials (SSID, password, security type)
- **vCard** — contact cards
- **WhatsApp** — pre-filled WhatsApp messages
- **Email** — mailto links with subject and body
- **SMS** — pre-filled text messages

### Customisation
- **Colors** — foreground and background color pickers with live hex value display
- **Transparent background** — toggle to remove the background; preview auto-adjusts to a contrasting color while the downloaded file stays fully transparent
- **Patterns** — six dot styles for QR modules: Square, Rounded, Dots, Extra Rounded, Classy, Classy Rounded
- **Corners** — six finder-pattern styles combining square, rounded, and circle outer/inner shapes
- **Frames** — five decorative frame options: none, simple border, label below, banner below, label above
- **Logo / center image** — embed any PNG, JPG, or SVG in the center of the QR code (error correction auto-raised to Q)
- **Tooltips** — hover any pattern, corner, or frame icon for an instant label

### Export
- **PNG** — raster export at 512 × 512 px with full transparency and frame compositing
- **SVG** — lossless vector, ideal for print
- **Copy to clipboard** — copy the QR as a PNG image in one click

### UX
- Live preview updates instantly as you change any option
- Smooth fade-in animation when the QR first renders
- **Reset to defaults** — one click to restore all settings
- No scroll on desktop — layout fits within the viewport

## Tech Stack

| Layer | Library |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| QR engine | [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) |
| UI components | [shadcn/ui](https://ui.shadcn.com) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + [Autoprefixer](https://github.com/postcss/autoprefixer) |
| Icons | [Lucide](https://lucide.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |

## Deployment

Hosted on [Netlify](https://netlify.com) at **[qrgen.meetsid.dev](https://qrgen.meetsid.dev)**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
