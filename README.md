# Finzo Finance Manager

Welcome to Finzo, a modern personal finance manager built with Next.js, Clerk, Hono, and Drizzle ORM. This application provides a comprehensive suite of tools to help you track your income, expenses, and investments, with a focus on a clean user interface and powerful data visualization.

## How It Works: A Step-by-Step Guide

This project follows a modern, full-stack TypeScript architecture, with a clear separation between the frontend UI, the backend API, and the database layer.

### 1. **Authentication with Clerk (`app/layout.tsx`)**

- **What it does:** The entire application is wrapped in Clerk's `<ClerkProvider>`.
- **How it works:** Clerk handles all user authentication, including sign-in, sign-up, and session management. It provides a secure and easy way to manage user identities without needing to build an authentication system from scratch.

### 2. **Frontend UI with Next.js and Tailwind CSS**

- **What it does:** The user interface is built with React components, styled with Tailwind CSS, and structured using Next.js's App Router.
- **Key Components:**
    - **`app/(dashboard)/layout.tsx`**: Sets up the main dashboard layout, including the header and navigation.
    - **`app/(dashboard)/page.tsx`**: The main dashboard page, which is composed of two primary components:
        - **`components/data-grid.tsx`**: Displays a grid of summary cards (e.g., "Total Revenue," "Total Expenses").
        - **`components/data-charts.tsx`**: Renders various charts to visualize financial data.
    - **`components/ChatBotGemini.tsx`**: A feature-rich AI chatbot that connects to the Gemini API for natural language queries. It includes speech-to-text and text-to-speech for a fully interactive experience.

### 3. **Data Fetching with TanStack Query (`providers/query-provider.tsx`)**

- **What it does:** Manages all data fetching from the backend API.
- **How it works:** Instead of using traditional `useEffect` hooks for data fetching, the app uses TanStack Query. This provides a robust system for caching, refetching, and keeping the UI in sync with the database, leading to a much smoother user experience.

### 4. **Backend API with Hono (`app/api/[[...route]]/route.ts`)**

- **What it does:** The backend is a modular API built with Hono, a lightweight and fast web framework.
- **How it works:** The main API route (`app/api/[[...route]]/route.ts`) acts as a central hub, delegating requests to specialized route files:
    - `.../accounts.ts`: Handles all CRUD (Create, Read, Update, Delete) operations for bank accounts.
    - `.../transactions.ts`: Manages transaction data.
    - `.../categories.ts`: Handles spending categories.
    - `.../summary.ts`: Provides aggregated summary data for the dashboard.
    - `.../chat/route.ts`: Connects to the Gemini API to power the AI chatbot.

### 5. **Database with Drizzle ORM (`db/schema.ts`, `drizzle.config.ts`)**

- **What it does:** The application uses Drizzle ORM to interact with a PostgreSQL database.
- **How it works:**
    - **`db/schema.ts`**: Defines the entire database schema in TypeScript, providing strong type safety.
    - **`drizzle.config.ts`**: Configures Drizzle to connect to your database.
    - **`scripts/migrate.ts`**: A simple script to run database migrations, ensuring your schema stays up-to-date.

### 6. **Key Features and How They Work**

- **AI Chatbot (`components/ChatBotGemini.tsx`)**:
    - **UI**: A pop-up chat window with a message list, user input, and a "send" button.
    - **Backend**: Sends user messages to the `/api/chat` endpoint.
    - **Gemini API**: The backend formats the conversation and sends it to the Gemini API for a natural language response.
    - **Speech-to-Text**: Uses the browser's `SpeechRecognition` API to convert spoken words into text.
    - **Text-to-Speech**: Uses the browser's `SpeechSynthesis` API to read out the AI's responses.

- **Plaid Integration (`app/api/plaid/...`)**:
    - **What it is:** A set of API routes for securely connecting to users' bank accounts via Plaid.
    - **How it works:**
        - **`create-link-token`**: Generates a secure token to initialize the Plaid Link flow.
        - **`exchange-token`**: Swaps the public token from Plaid Link for a permanent access token.
        - **`sync-transactions`**: Fetches and syncs the latest transactions from the connected bank account.

This structure provides a robust, scalable, and maintainable foundation for your finance application.
