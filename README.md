# User Management App

This is a comprehensive user management application built with Next.js, featuring role-based access control, tenant management, and user authentication.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB database

## Setup Instructions

1. Clone the repository:
   \`\`\`
   git clone https://github.com/RakshitArora03/User-Management-App.git
   cd User-Management-App
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
   or if you're using yarn:
   \`\`\`
   yarn install
   \`\`\`

3. Create a \`.env.local\` file in the root directory and add the following environment variables:

   \`\`\`
   # MongoDB connection string
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth secret (you can generate one using `openssl rand -base64 32`)
   NEXTAUTH_SECRET=your_nextauth_secret

   # NextAuth URL (use http://localhost:3000 for local development)
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth credentials (if using Google sign-in)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Email server settings (for sending verification emails)
   EMAIL_SERVER_HOST=your_smtp_host
   EMAIL_SERVER_PORT=your_smtp_port
   EMAIL_SERVER_USER=your_smtp_username
   EMAIL_SERVER_PASSWORD=your_smtp_password
   EMAIL_FROM=noreply@yourdomain.com

   # JWT secret for email verification tokens
   JWT_SECRET=your_jwt_secret

   # Secret for seeding admin user (change this to a secure value)
   SEED_SECRET=your_seed_secret
   \`\`\`

   Replace the placeholder values with your actual configuration.

4. Set up the database:
   - Ensure your MongoDB instance is running.
   - The application will automatically create the necessary collections when it first runs.

5. Seed the admin user:
   Run the following command to create the initial admin user:
   \`\`\`
   npm run seed-admin
   \`\`\`
   or with yarn:
   \`\`\`
   yarn seed-admin
   \`\`\`

6. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`
   or with yarn:
   \`\`\`
   yarn dev
   \`\`\`

7. Open your browser and navigate to \`http://localhost:3000\`. You should see the application running.

## Default Admin Credentials

After seeding the admin user, you can log in with the following credentials:

- Email: admin@example.com
- Password: secureAdminPassword123!

Make sure to change this password after your first login.

## Features

- User authentication (sign up, sign in, password reset)
- Role-based access control (Admin, Manager, User)
- Tenant management
- User management (invite, promote, demote, remove)
- Responsive design

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

