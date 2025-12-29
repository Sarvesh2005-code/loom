# S2C (Sketch to Code) - Loom

An AI-powered SaaS application that converts wireframes and sketches into production-ready code. Built with Next.js 15, Convex, and AI integrations.

## 🚀 Features

- **AI-Powered Design to Code**: Convert sketches into clean, usable code.
- **Infinite Canvas**: Figma-like canvas for freehand drawing and element manipulation.
- **Mood Boards**: AI-assisted mood board generation.
- **Authentication**: Secure login via Google OAuth (powered by Convex Auth).
- **Real-time Collaboration**: Built on Convex's reactive database.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Shadcn UI
- **Backend**: Convex (BaaS)
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: Convex Auth
- **AI**: Anthropics API (Claude) (Upcoming)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js & npm
- A [Convex](https://convex.dev) account
- A Google Cloud Console project (for OAuth)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sarvesh2005-code/loom.git
    cd loom
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Initialize Convex:**
    ```bash
    npx convex dev
    ```

### 🔐 Authentication Setup (Google OAuth)

To enable Google Sign-In, you need to configure OAuth credentials in the Google Cloud Console.

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "S2C Loom").
3.  Navigate to **APIs & Services > OAuth consent screen**.
    - User Type: **External**
    - Fill in required app information.
4.  Navigate to **Credentials > Create Credentials > OAuth client ID**.
    - Application Type: **Web application**
    - **Authorized JavaScript origins**:
        - `http://localhost:3000` (for local dev)
        - Your production URL (later)
    - **Authorized redirect URIs**:
        - `http://localhost:3000/api/auth/callback/google` (standard NextAuth/Auth.js pattern)
        - *Note:* Convex Auth sometimes uses specific callback URLs. Check your Convex dashboard if the above doesn't work.
5.  **Copy the Credentials**:
    - Client ID
    - Client Secret

6.  **Add to Convex Dashboard**:
    - Go to your project settings in the Convex Dashboard.
    - Add the following Environment Variables:
        - `CONVEX_AUTH_GOOGLE_CLIENT_ID`: (Your Client ID)
        - `CONVEX_AUTH_GOOGLE_CLIENT_SECRET`: (Your Client Secret)

## 💻 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 License

[MIT](LICENSE)
