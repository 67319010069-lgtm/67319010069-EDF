# Eduflow Clone - Setup Instructions

## 📋 Prerequisites
- Node.js 18+ installed
- Supabase account

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase

#### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

#### Run Database Setup
1. Go to your Supabase Dashboard
2. Click on "SQL Editor"
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute

#### Create Storage Buckets
1. Go to "Storage" in Supabase Dashboard
2. Create three public buckets:
   - `avatars`
   - `thumbnails`
   - `course-files`
3. For each bucket, set it to "Public" in the settings

### 3. Configure Environment Variables

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in: Supabase Dashboard > Settings > API

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Features

### For Students
- Browse and search courses
- Enroll in courses
- Track learning progress
- Rate and review courses
- Manage profile

### For Instructors
- Create and manage courses
- Add lessons (video, text, PDF, audio)
- Publish/unpublish courses
- View analytics
- Manage profile

## 🗂 Project Structure

```
67319010069/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── courses/           # Course catalog
│   │   ├── dashboard/         # User dashboard
│   │   ├── instructor/        # Instructor features
│   │   ├── learn/             # Student learning interface
│   │   └── profile/           # Profile management
│   └── lib/
│       └── supabase.ts        # Supabase client & helpers
├── supabase-setup.sql         # Database schema
├── .env.local                 # Environment variables
└── package.json
```

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: React Icons

## 📝 Database Schema

- **profiles**: User information
- **courses**: Course data
- **lessons**: Lesson content
- **enrollments**: Student enrollments and progress
- **reviews**: Course ratings and reviews

## 🔐 Authentication

Uses Supabase Auth with email/password. Supports two roles:
- **student**: Can browse and enroll in courses
- **instructor**: Can create and manage courses

## 🎯 Next Steps

1. Create a test instructor account
2. Create a sample course with lessons
3. Create a test student account
4. Enroll in the course and test the learning interface
5. Leave a review

## 🐛 Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` has the correct Supabase URL and anon key
- Restart the dev server after changing environment variables

### Database errors
- Make sure you ran the `supabase-setup.sql` script
- Check that RLS policies are enabled

### Images not loading
- Verify storage buckets are created and set to public
- Check that image URLs are correct

## 📞 Support

For issues or questions, please check:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
