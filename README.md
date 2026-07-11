# huckepack - KI Design Editor

A modern React-based component editor built with Vite and Convex. This application combines a powerful frontend built with React and Vite, with a robust Convex backend for real-time database, authentication, and AI-powered features.

## Tech Stack

### Frontend

- **Vite** - Fast build tool and development server
- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Electron** - Desktop app wrapper
- **Zustand** - State management
- **Convex** - Real-time database and backend

### Backend

- **Convex** - Real-time database, authentication, and backend functions
- **TypeScript** - Type safety for backend
- **OpenAI/Mistral** - AI chat functionality
- **GitHub API** - Repository integration

## Getting Started

### Prerequisites

Make sure you have Node.js (version 18 or higher recommended) and [pnpm](https://pnpm.io/installation) installed.

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp env.example.txt .env
```

Fill in the required environment variables in `.env`.

### Development

#### Development Server

```bash
pnpm dev
```

This starts the Vite dev server at http://localhost:5173

#### Electron Desktop App

```bash
pnpm electron-dev
```

### Project Structure

```
huckepack/
├── app/              # Frontend React application
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility libraries
│   ├── pages/        # Page components
│   └── stores/       # Zustand stores
├── convex/           # Convex backend functions
│   ├── lib/          # Helper functions (auth, access control)
│   ├── github/       # GitHub integration actions
│   └── ai/           # AI chat actions
└── electron/         # Electron main and preload scripts
```

### Building for Production

#### Build Frontend

```bash
pnpm build
```

#### Build Electron App

```bash
pnpm electron-pack
```

### Convex Setup

1. Install Convex CLI (if not already installed):

```bash
pnpm add -g convex
```

2. Initialize Convex in your project:

```bash
pnpm exec convex dev
```

This will:
- Create a `convex/` directory
- Set up Convex configuration
- Generate TypeScript types
- Start the Convex development server

3. Set up Convex environment variables in the Convex dashboard or `.env.local`:

```bash
CONVEX_DEPLOYMENT=your-deployment-url
```

### Convex HTTP Endpoints

Convex provides HTTP actions for webhooks and API endpoints:

- `POST /github/webhook` - GitHub webhook handler
- `POST /ai/chat/stream` - AI chat streaming (placeholder)

### Convex Functions

The Convex backend provides:

- **Queries** - Reactive data fetching (auto-updates on changes)
- **Mutations** - Database writes with automatic optimistic updates
- **Actions** - External API calls (GitHub, OpenAI)
- **HTTP Actions** - Webhook handlers and API endpoints

### Environment Variables

Key environment variables needed:

#### Convex
- `CONVEX_DEPLOYMENT` - Convex deployment URL (auto-set by `pnpm exec convex dev`)

#### GitHub Integration
- `GITHUB_APP_ID` - GitHub App ID
- `GITHUB_APP_PRIVATE_KEY` - GitHub App private key (as string, not file path)
- `GITHUB_WEBHOOK_SECRET` - GitHub webhook secret for signature verification

#### AI Services
- `OPENAI_API_KEY` - OpenAI API key
- `MISTRAL_API_KEY` - Mistral AI API key

## Learn More

To learn more about the technologies used:

- [Vite Documentation](https://vitejs.dev/) - Learn about Vite features and configuration
- [React Documentation](https://react.dev/) - Learn React
- [Convex Documentation](https://docs.convex.dev/) - Learn about Convex real-time database
- [Electron Documentation](https://www.electronjs.org/docs) - Learn about Electron

## Convex Features

This application uses Convex for:

- **Real-time Database** - Automatic reactive queries that update when data changes
- **Authentication** - Built-in auth with GitHub and Google OAuth
- **Optimistic Updates** - UI updates instantly, syncs automatically
- **Collaborative Editing** - Real-time presence and code synchronization
- **Access Control** - Role-based permissions for workspaces, teams, and projects
- **Pagination** - Built-in pagination for large lists
- **HTTP Actions** - Webhook handlers and API endpoints

## Deployment

### Vercel

The project is configured for Vercel deployment:

```bash
pnpm vercel-build
```

The `vercel.json` configuration handles routing for the Vite frontend.

### Manual Deployment

1. Build the frontend: `pnpm build`
2. Serve the frontend from the `dist` directory
