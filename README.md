# S2C (Sketch to Code)

An AI-powered SaaS application for converting sketches to code/designs, reconstructed from the "Default_AI SaaS" tutorial.

## Features
*   **Infinite Canvas**: Figma-like drawing experience (Redux + React).
*   **Mood Board**: Drag-and-drop image organization (Convex Storage).
*   **AI Generation**: Text-to-UI generation (Simulated "Stitch" feature).
*   **Authentication**: Secure Google OAuth via Convex Auth.
*   **Modern UI**: Built with Shadcn UI, Tailwind CSS v4, and Dark Mode support.

## Tech Stack
*   **Frontend**: Next.js 15 (App Router), TypeScript
*   **Backend**: Convex (Database, Auth, Storage, Functions)
*   **State Management**: Redux Toolkit (Canvas state)
*   **Styling**: Tailwind CSS, Shadcn UI

## Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Sarvesh2005-code/loom.git
    cd loom
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Local Development**:
    Start the frontend and backend servers:
    ```bash
    npm run dev
    npx convex dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

### Configuration
1.  **Convex Setup**:
    Initialize Convex if not done already:
    ```bash
    npx convex dev
    ```
    This will generate your `.env.local` file with `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.

2.  **Google OAuth**:
    *   Create OAuth credentials in Google Cloud Console.
    *   Add `CONVEX_AUTH_GOOGLE_CLIENT_ID` and `CONVEX_AUTH_GOOGLE_CLIENT_SECRET` to your environment variables in the Convex Dashboard.

## Deployment (Vercel)
1.  Push to GitHub.
2.  Import project in Vercel.
3.  Add the following Environment Variables in Vercel:
    *   `CONVEX_DEPLOYMENT` (Production value)
    *   `NEXT_PUBLIC_CONVEX_URL` (Production value)
    *   `CONVEX_AUTH_GOOGLE_CLIENT_ID`
    *   `CONVEX_AUTH_GOOGLE_CLIENT_SECRET`
4.  Deploy!

## License
MIT
