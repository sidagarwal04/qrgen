# QRgen

A modern, fully-featured QR code generator built with Next.js. Generate, style, and download QR codes for any use case — no account required.

## Features

### QR Code Types
- **URL** — website links
- **Text** — plain text
- **WiFi** — network credentials (SSID, password, security type)
- **vCard** — contact cards
- **WhatsApp** — pre-filled WhatsApp messages
- **Email** — mailto links with subject and body
- **SMS** — pre-filled text messages

### Customisation
- **Colors** — choose any foreground (primary) and background color via color pickers
- **Transparent background** — toggle to remove the background; the preview auto-adjusts to a contrasting color so the QR remains visible, while the downloaded file stays fully transparent
- **Patterns** — six dot styles for the QR modules: Square, Rounded, Dots, Extra Rounded, Classy, Classy Rounded
- **Corners** — six finder-pattern styles combining square, rounded, and circle outer/inner shapes
- **Frames** — five decorative frame options (none, simple border, label below, banner below, label above) with a customisable label text
- **Logo / center image** — embed any PNG, JPG, or SVG image in the center of the QR code (error correction automatically raised to Q for reliability)

### Download
- **SVG** — lossless vector, ideal for print
- **PNG** — raster export at 1024 × 1024 px, with full transparency support and frame compositing

### UX
- Live preview updates instantly as you change any option
- **Reset to defaults** — one click to restore all settings to their original state
- No scroll on desktop — layout fits within the viewport
- Built-in credit line in the header

## Tech Stack

| Layer | Library |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| QR engine | [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) |
| UI components | [shadcn/ui](https://ui.shadcn.com) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Icons | [Lucide](https://lucide.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
