# Viva RGC - Next.js Web Application

A full-stack, responsive web application developed for the Viva Rhythmic Gymnastics Club. Built with Next.js 15, React, and Supabase, this project serves as a comprehensive digital platform that couples a modern user interface with a custom-built content management system (CMS).

## Architecture & Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL)
- **Email Communications**: Resend API
- **Icons**: Lucide React
- **Deployment**: Vercel

## Key Technical Features

- **Custom Content Management System (CMS)**: Engineered a secure admin dashboard allowing non-technical stakeholders to independently manage website content, schedules, and coach profiles without requiring codebase deployments.
- **Dynamic Content Pipelines**:
  - **Billboard & Home Page**: Real-time updates for announcements and landing page hero graphics.
  - **Program & Schedule Management**: Dynamic tracking of class schedules, pricing tiers, and program details.
  - **Gallery & Asset Management**: Integrated image upload and gallery rendering pipeline with cloud storage.
- **Resend Email Integration**: Configured reliable automated email communications using the Resend API (e.g., for contact forms or notifications).
- **Secure Authentication**: Implemented server-side API validation to protect administrative routes and prevent unauthorized access to the CMS.
- **Modern Responsive UI**: Utilized Tailwind CSS to ensure a highly performant and accessible interface across all device form factors.
- **Relational Database Architecture**: Structured PostgreSQL schemas designed for highly optimized content retrieval across the platform.

## Local Development Setup

To run this project locally, clone the repository and install dependencies:

```bash
npm install
```

### Environment Configuration

Configure the necessary environment variables by duplicating the example file:

```bash
cp .env.local.example .env.local
```

Populate the following variables in `.env.local` with your respective credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key, server-side only
- `RESEND_API_KEY`: Resend API key for email services
- `ADMIN_PASSWORD`: Secure string required for accessing the admin CMS

### Database Setup

Run these in the Supabase SQL Editor, in order:

1. `supabase-schema.sql` - content tables and the images storage bucket
2. `supabase-page-content.sql` - editable copy for the home and about pages
3. `supabase-security.sql` - reduces the anon key to read-only and adds the
   snapshot table behind the admin's "Undo last save"

Step 3 requires `SUPABASE_SERVICE_ROLE_KEY` to be set first, in `.env.local` and
in the Vercel project. Once it is applied, the public anon key can only read;
every write goes through the authenticated admin API routes.

## Security Model

- The `/admin` login checks `ADMIN_PASSWORD` and issues a signed, httpOnly
  session cookie valid for 8 hours. Middleware enforces it on every
  `/api/admin/*` request, so the API is not reachable without logging in.
- Writes to Supabase happen server-side with the service role key. The anon key
  in the browser bundle is read-only after `supabase-security.sql`.
- Media uploads use one-time signed upload URLs: the API route issues the token,
  the browser sends the file straight to Supabase. This keeps large files off the
  serverless request path, which Vercel caps at 4.5 MB.

To confirm the lockdown is actually in force, run:

```bash
npm run verify:security
```

It checks that the public anon key can still read every table the site needs and
can no longer write to any of them, that the snapshot table is server-only, that
uploaded files stay publicly readable while direct anon uploads are refused, and
that the service role can still write. The checks are non-destructive: write
permission is probed by inserting a uniquely named throwaway row, which is
removed again if it lands. Expect failures in sections 2 and 4 until
`supabase-security.sql` has been applied.

### Running the Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`. The secure admin dashboard is located at `/admin`.

## License

This project is available under the [MIT License](LICENSE).
