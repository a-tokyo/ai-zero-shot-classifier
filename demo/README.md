# AI Zero-Shot Classifier Demo

This is a [Next.js](https://nextjs.org) demo showcasing the **ai-zero-shot-classifier** library with multiple AI providers.

## Installation

Before running the demo, make sure you have all dependencies installed:

```bash
npm install
```

The demo includes both OpenAI and Groq SDK dependencies to showcase all features of the ai-zero-shot-classifier library.

## Environment Setup

Create a `.env.local` file in the demo directory with your API keys:

```env
OPENAI_API_KEY=your-openai-api-key-here
GROQ_API_KEY=your-groq-api-key-here
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Notes:
- Turbopack is disabled in dev mode since it has no support for externalDir imports
- This demo includes both OpenAI and Groq dependencies to showcase all library features
