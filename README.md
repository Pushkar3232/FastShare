# 📁 FastShare

> **Safe, temporary file sharing for college labs. No login. No hassle.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

---

## 🎯 Overview

FastShare is a **privacy-focused, temporary file sharing web application** designed specifically for college labs and public computer environments. Create a room, share a code, and securely exchange files without any registration or login.

**Key Benefits:**
- ✅ Instant room creation (no account required)
- ✅ 30-minute auto-expiring sessions
- ✅ Automatic file deletion after expiry
- ✅ Dark modern UI optimized for lab PCs
- ✅ QR code room sharing
- ✅ Works on mobile & desktop

---

## ✨ Features

### Core Features
- **Create Rooms**: Generate random 6-character room codes instantly
- **Join Rooms**: Enter code to access shared spaces
- **File Upload**: Drag & drop interface for easy file sharing
- **Countdown Timer**: Real-time session expiry countdown
- **Auto-Delete**: Automatic cleanup of expired rooms and files
- **Signed URLs**: Secure file downloads via private storage
- **QR Codes**: Share rooms via QR code scanning
- **Copy-to-Clipboard**: One-click room code copying

### Supported File Types
- 🖼️ **Images**: JPEG, PNG, GIF, WebP
- 📄 **Documents**: PDF
- **Max File Size**: 10MB per file

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router, SSR)
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **QR Code Generator** (qrcode.react)

### Backend
- **Next.js API Routes**
- **Server-Side Rendering (SSR)**

### Database & Storage
- **Supabase PostgreSQL** for relational data
- **Supabase Storage** for private file bucket
- **RLS Policies** for security

### DevOps
- **Vercel** (recommended hosting)
- **Git** for version control

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com))
- **Supabase Account** ([Create Free](https://supabase.com))

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Pushkar3232/FastShare.git
cd FastShare
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or open existing one
3. Copy your project credentials:
   - Project URL
   - Public Anon Key

### 4️⃣ Configure Environment Variables

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://ceszkugssgzglavtyfpd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xVkDSMvcnmvg_ENY90iZfg_waQHQUm0
```

### 5️⃣ Initialize Database & Storage

Run the setup scripts to create tables and storage bucket:

```bash
# Create database tables (rooms, files) with indexes and RLS policies
node scripts/setup-db.js

# Create storage bucket with proper permissions
node scripts/setup-storage-sql.js
```

**Expected Output:**
```
✓ Tables created successfully!
  - public.rooms
  - public.files
  - Indexes created
  - RLS policies set

✓ Storage bucket 'rooms-storage' created!
✓ Storage policies set!
```

### 6️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
fastshare/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── rooms/               # Room management endpoints
│   │   │   ├── route.ts         # POST /api/rooms (create)
│   │   │   ├── [code]/          # Dynamic room routes
│   │   │   │   ├── route.ts     # GET/DELETE room
│   │   │   │   └── files/       # File operations
│   │   │   └── files/route.ts   # GET/POST files
│   │   └── cleanup/             # Auto-delete cleanup endpoint
│   ├── room/                     # Room pages
│   │   └── [code]/              # Dynamic room page (SSR)
│   ├── create/                   # Create room page
│   ├── join/                     # Join room page
│   ├── layout.tsx               # Root layout with navbar
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles with Tailwind
│   └── not-found.tsx            # 404 page
├── components/                   # React components
│   ├── Navbar.tsx               # Top navigation bar
│   ├── LoadingScreen.tsx        # Loading skeleton
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx           # Primary button component
│       ├── Card.tsx             # Card wrapper component
│       ├── Input.tsx            # Text input with validation
│       ├── CountdownTimer.tsx   # Expiry countdown display
│       ├── UploadArea.tsx       # Drag & drop upload zone
│       └── RoomCodeDisplay.tsx  # Room code display + copy
├── lib/                          # Utility functions & configs
│   ├── supabase.ts             # Supabase client setup
│   ├── constants.ts            # App-wide constants
│   └── utils.ts                # Helper functions
├── public/                       # Static assets
│   ├── logo.png                # App icon
│   ├── logo-text.png           # Full logo with text
│   └── [other SVGs]            # Additional icons
├── scripts/                      # Setup scripts
│   ├── setup-db.js             # Database initialization
│   └── setup-storage-sql.js    # Storage bucket setup
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.mjs          # PostCSS config
└── .env.local                  # Environment variables (don't commit)
```

---

## 🔌 API Documentation

### Room Management

#### Create Room
```http
POST /api/rooms
Content-Type: application/json

Response: 201 Created
{
  "id": "uuid",
  "room_code": "ABC123",
  "created_at": "2026-02-14T10:00:00.000Z",
  "expires_at": "2026-02-14T10:30:00.000Z"
}
```

#### Get Room
```http
GET /api/rooms/{code}

Response: 200 OK
{
  "id": "uuid",
  "room_code": "ABC123",
  "created_at": "...",
  "expires_at": "..."
}
```

#### Delete Room (End Session)
```http
DELETE /api/rooms/{code}

Response: 200 OK
{
  "success": true
}
```

### File Management

#### Upload File
```http
POST /api/rooms/{code}/files
Content-Type: multipart/form-data

Body:
- file: (binary file data)

Response: 201 Created
{
  "id": "uuid",
  "room_id": "uuid",
  "file_name": "document.pdf",
  "file_path": "rooms/uuid/1707902400000_document.pdf",
  "uploaded_at": "2026-02-14T10:05:00.000Z",
  "signed_url": "https://..."
}
```

#### List Files
```http
GET /api/rooms/{code}/files

Response: 200 OK
[
  {
    "id": "uuid",
    "file_name": "image.png",
    "signed_url": "https://...",
    "uploaded_at": "..."
  },
  ...
]
```

### Cleanup

#### Trigger Cleanup (Remove Expired Rooms)
```http
POST /api/cleanup

Response: 200 OK
{
  "deleted": 5
}
```

---

## 💻 Usage Guide

### For Users (Lab Environment)

1. **Create a Room**
   - Click "Create Room" on home page
   - Share the 6-character code with others

2. **Join a Room**
   - Click "Join Room"
   - Enter the 6-character code
   - Wait for room to load

3. **Upload Files**
   - Drag & drop files into upload area
   - Or click to browse files
   - Files automatically appear for all users

4. **Download Files**
   - Click download icon on any file
   - File opens in new tab

5. **Share via QR Code**
   - Click "Show QR Code"
   - Scan with phone camera
   - Instant redirect to room

6. **End Session**
   - Click "End Session"
   - All files permanently deleted
   - Room expires after 30 minutes (auto)

### For Developers

#### Running Development Server
```bash
npm run dev
# App runs at http://localhost:3000
```

#### Building for Production
```bash
npm run build
npm start
```

#### Linting
```bash
npm run lint
```

#### Database Setup (One-time)
```bash
node scripts/setup-db.js
node scripts/setup-storage-sql.js
```

---

## 🎨 Design System

### Color Palette
- **Background**: `#040204` (Dark)
- **Primary Text**: `#fefeff` (Off-white)
- **Brand Color**: `#6dd07d` (Green)
- **Accent**: `#64cc77` (Light green)

### UI Principles
- Dark theme (lab-friendly, eye-friendly)
- Large clickable areas (touchpad-friendly)
- Minimal animations (fast transitions only)
- Focus on clarity and speed

---

## 🔒 Security

### Database Security
- **Row-Level Security (RLS)** policies enabled
- Tables scoped to public use (no sensitive data stored)
- All connections use HTTPS

### Storage Security
- **Private bucket** (no public access)
- Files accessed via **signed URLs** (30-minute validity)
- Automatic file deletion on room expiry

### Best Practices
- Environment variables stored in `.env.local` (not committed)
- CORS restrictions on Supabase storage
- No user authentication (intentionally anonymous)

---

## 📊 Database Schema

### `rooms` Table
```sql
- id (UUID, Primary Key)
- room_code (TEXT, Unique)
- created_at (TIMESTAMPTZ)
- expires_at (TIMESTAMPTZ)
```

### `files` Table
```sql
- id (UUID, Primary Key)
- room_id (UUID, Foreign Key → rooms.id)
- file_name (TEXT)
- file_path (TEXT)
- uploaded_at (TIMESTAMPTZ)
```

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" → Import GitHub repo
4. Add environment variables
5. Click "Deploy"

**Environment Variables on Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Deploy on Other Platforms

Ensure Node.js 18+ is available. Fast Refresh requires Next.js App Router support.

---

## 🐛 Troubleshooting

### Error: "Could not find the table 'public.rooms'"
**Solution:** Run database setup scripts
```bash
node scripts/setup-db.js
node scripts/setup-storage-sql.js
```

### Error: ".env.local not found"
**Solution:** Create `.env.local` with Supabase credentials
```bash
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env.local
```

### Error: "Failed to upload file"
**Solution:** Check Supabase storage bucket permissions
- Verify bucket name is `rooms-storage`
- Check file size < 10MB
- Verify file type is allowed (images/PDF)

### Dev Server Not Starting
**Solution:** Clear cache and rebuild
```bash
rm -rf .next
npm run dev
```

---

## 🤝 Contributing

We welcome contributions! Here's how to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Test changes locally before submitting
- Update README if adding features

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Pushkar** - [GitHub](https://github.com/Pushkar3232)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Supabase](https://supabase.com) - Backend platform
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [QR Code Generator](https://github.com/davidshimjs/qrcodejs) - QR codes

---

## 📞 Support

For issues, questions, or feedback:
- Open an [Issue](https://github.com/Pushkar3232/FastShare/issues)
- Start a [Discussion](https://github.com/Pushkar3232/FastShare/discussions)
- Contact via GitHub

---

<div align="center">

**Built with ❤️ for College Labs**

[⬆ Back to Top](#-fastshare)

</div>
