# Daily Updates App

A web application to track your daily accomplishments.

## Features

- 📝 Create daily updates
- 📊 View your update history
- 📈 Statistics (total count, daily breakdown, frequent words)
- 👤 Simple user profile

## Technologies Used

- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **UI**: Tailwind CSS and shadcn/ui
- **Database**: Firebase Firestore

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase:
   - For detailed instructions, see the Firebase setup documentation
   - For quick development, you can skip this step as the app will use a mock implementation

4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app` - Application pages (Next.js App Router)
- `/src/components` - Reusable React components
- `/src/lib` - Utilities and services
  - `firebase-admin.ts` - Firebase configuration and utilities
  - `updates.ts` - Firestore operations for updates
- `/src/types` - TypeScript types

## API

The application exposes the following API endpoints:

- `GET /api/updates` - Retrieve all updates
- `POST /api/updates` - Create a new update
- `GET /api/stats` - Get update statistics

## Firestore Collection

The application uses a Firestore collection called `updates` with the following structure:
```
{
  id: string (automatically generated),
  userId: string,
  content: string,
  createdAt: Timestamp
}
```

## Authentication

Authentication is simulated in this version of the application, with a fixed user ID (1).

## Development Mode

In development mode, the application will use a mock implementation of Firestore if Firebase environment variables are not configured. This allows for quick development without needing to set up Firebase immediately.

For production deployment, make sure to properly configure the environment variables as described in the Firebase setup documentation.

## License

MIT
