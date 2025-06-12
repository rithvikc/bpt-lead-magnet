# BPT Fulfillment Pricing Calculator

A comprehensive 3PL fulfillment pricing calculator for BPT Fulfillment. This web application provides instant, accurate pricing for various 3PL services including receiving, storage, pick & pack, shipping, and more.

## Features

- Receiving Calculator
- Storage Calculator
- Pick & Pack Calculator
- More calculators to come

## Tech Stack

- Next.js 15.3.3
- React 19
- TypeScript
- Tailwind CSS
- Zustand (for state management)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - React components
- `/src/components/calculators` - Calculator components
- `/public` - Static assets

## Development

To add or modify calculators, update the corresponding files in `/src/components/calculators`.

## Deployment

Build the project for production:
```
npm run build
```

Start the production server:
```
npm start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
