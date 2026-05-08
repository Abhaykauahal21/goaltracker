# 🚀 GoalTracker - Modern Daily Roadmap Tracker

GoalTracker is a high-performance, feature-rich web application designed to help users manage their long-term learning journeys and daily tasks through interactive roadmaps, milestones, and gamified progress tracking.

![GoalTracker Preview](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop)

## ✨ Key Features

- **🏆 Gamified Progress**: Earn XP, level up, and maintain streaks as you complete tasks. Unlock achievements like "Early Bird" or "Consistency King".
- **🗺️ Interactive Roadmaps**: Create custom learning paths or upload them via JSON. Organize your journey into milestones and granular tasks.
- **📊 Advanced Analytics**: Visualize your productivity with beautiful charts powered by Recharts. Track focus time and task completion velocity.
- **📅 Visual Calendar**: See your past and upcoming tasks in an interactive calendar view.
- **⏱️ Daily Planner & Pomodoro**: A dedicated space to focus on today's tasks with a built-in Pomodoro timer to boost productivity.
- **🌓 Dark Mode**: Full support for light and dark themes with a sleek, modern UI.
- **⚡ High Performance**: Optimized with Next.js 16, utilizing `unstable_cache` for instant data retrieval and skeleton loading states for seamless transitions.
- **🔒 Secure Auth**: Integrated with Clerk for robust, social-ready authentication.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL/SQLite
- **Auth**: [Clerk](https://clerk.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Folder Structure

```text
goaltracker/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── src/
    ├── actions/            # Next.js Server Actions for mutations
    ├── app/                # Next.js App Router (Pages & API)
    │   ├── (auth)/         # Authentication routes (Sign-in/Sign-up)
    │   └── (protected)/    # App routes requiring authentication
    │       ├── achievements/ # XP and Badge system
    │       ├── analytics/    # Productivity metrics and charts
    │       ├── calendar/     # Visual task calendar
    │       ├── dashboard/    # Main overview and stats
    │       ├── planner/      # Daily tasks and Pomodoro
    │       └── roadmaps/     # Roadmap and Milestone management
    ├── components/
    │   ├── features/       # Feature-specific complex components
    │   ├── layout/         # Navigation, Sidebar, and AppLayout
    │   ├── providers/      # Context providers (Theme, Tooltip, etc.)
    │   └── ui/             # Reusable base UI components (shadcn/ui)
    ├── hooks/              # Custom React hooks
    ├── lib/                # Utility functions, database client, and data fetching
    ├── store/              # Zustand state stores
    └── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- A PostgreSQL database (or change the provider in `schema.prisma` to `sqlite`)
- A Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/goaltracker.git
   cd goaltracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root and add the following:
   ```env
   DATABASE_URL="your_database_url"
   
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your Environment Variables in the Vercel project settings.
4. The `postinstall` script will automatically run `prisma generate`.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
