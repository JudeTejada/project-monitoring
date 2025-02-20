# Project Monitoring System

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.2.1-blue)](https://www.prisma.io)
[![React Query](https://img.shields.io/badge/React%20Query-5.66.0-ff4154)](https://tanstack.com/query)

A modern web application for monitoring and managing projects, built with Next.js and TypeScript.

## Features

- 🚀 Built with Next.js 15 and React 19
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🔒 Authentication system using better-auth
- 📊 Data visualization with Recharts
- 🗄️ Database management with Prisma ORM
- 📁 File uploads with uploadthing
- 🔄 Real-time data fetching with React Query

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version)
- pnpm (Recommended) or npm

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
```

5. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   └── providers/       # React context providers
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## Environment Variables

The following environment variables are required:

```
DATABASE_URL="your-database-url"
NEXT_PUBLIC_UPLOADTHING_URL="your-uploadthing-url"
# Add other required environment variables
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Deployment

This application can be deployed on [Vercel](https://vercel.com) with zero configuration. Simply connect your repository and deploy.

For other deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
