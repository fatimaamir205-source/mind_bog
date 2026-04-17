# AI-Powered Blogging Platform - Project Overview

## 🎯 Project Summary

A complete, production-ready frontend for a modern AI-powered blogging platform inspired by Medium, Dev.to, and Hashnode. Built with React 19, Vite, Tailwind CSS 4, and modern web technologies.

**Status:** ✅ Complete with all pages and components implemented

---

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework:** React 19 (Functional Components + Hooks)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 with OKLCH color system
- **UI Components:** shadcn/ui (pre-built component library)
- **Routing:** Wouter (lightweight client-side router)
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Charts:** Recharts
- **Notifications:** Sonner (toast system)
- **Icons:** Lucide React

### Design Philosophy

**Refined Minimalism with Intelligent Accents** - A contemporary approach combining Medium's editorial clarity with Stripe's sophisticated SaaS aesthetics.

**Key Design Principles:**
1. **Content-First Architecture** - Typography and whitespace are primary design tools
2. **Intelligent Color Restraint** - Limited, purposeful palette with vibrant teal accents for AI features
3. **Micro-Interactions Over Macro-Animation** - Subtle hover states and smooth 200-300ms transitions
4. **Asymmetric Layouts** - Varied column widths and dynamic positioning

**Color Palette:**
- **Primary Accent:** Vibrant teal (#0891B2 light / #06B6D4 dark) - AI features and CTAs
- **Secondary Accent:** Soft amber (#F59E0B) - highlights and notifications
- **Neutral Grays:** Slate palette for borders and muted text
- **Background:** Pure white (light) / Deep slate (dark)

---

## 📁 Project Structure

```
client/
├── public/                    # Static assets (favicon, manifest)
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx            # Top navigation with search & user menu
│   │   │   ├── Footer.tsx            # Footer with links & social
│   │   │   ├── Loader.tsx            # Loading spinners & skeletons
│   │   │   ├── ProtectedRoute.tsx    # Route protection wrapper
│   │   │   └── ErrorBoundary.tsx     # Error handling
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx          # Blog preview card component
│   │   │   └── CommentSection.tsx    # Comments with threading
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx      # Collapsible admin navigation
│   │   │   ├── StatsCard.tsx         # Dashboard stat cards
│   │   │   └── DataTable.tsx         # Reusable data table with pagination
│   │   └── ui/                       # shadcn/ui components
│   │
│   ├── pages/
│   │   ├── Home.tsx                  # Blog feed with trending sidebar
│   │   ├── Login.tsx                 # Email/password authentication
│   │   ├── Register.tsx              # Sign up with validation
│   │   ├── BlogDetails.tsx           # Full blog view with comments
│   │   ├── CreateBlog.tsx            # Rich text editor for new blogs
│   │   ├── EditBlog.tsx              # Edit existing blogs
│   │   ├── Profile.tsx               # User profile & blog history
│   │   ├── Dashboard.tsx             # User's blog management dashboard
│   │   ├── NotFound.tsx              # 404 error page
│   │   └── admin/
│   │       ├── AdminDashboard.tsx    # Admin stats & charts
│   │       ├── ManageUsers.tsx       # User management table
│   │       ├── ManageBlogs.tsx       # Blog moderation table
│   │       ├── Reports.tsx           # Content reports & moderation
│   │       └── Settings.tsx          # Platform configuration
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Authentication state & methods
│   │   └── ThemeContext.tsx          # Dark mode toggle
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth context hook
│   │   └── useFetch.ts               # Data fetching with loading/error
│   │
│   ├── services/
│   │   └── api.ts                    # Axios API client with interceptors
│   │
│   ├── App.tsx                       # Route definitions & layout
│   ├── main.tsx                      # React entry point
│   └── index.css                     # Global styles & design tokens
│
├── index.html                        # HTML template with fonts
└── package.json                      # Dependencies & scripts
```

---

## 🧭 Page Routes & Features

### Public Pages

| Route | Page | Features |
|-------|------|----------|
| `/` | **Home** | Blog feed, trending topics, recommended authors, tab switching |
| `/login` | **Login** | Email/password form, remember me, error handling, social login placeholders |
| `/register` | **Register** | Username/email/password with real-time validation, password confirmation |
| `/blog/:id` | **Blog Details** | Full content, author info, like/bookmark/share buttons, comment section |
| `/profile/:id` | **Profile** | User bio, stats, blog list, follow button, about section |

### Protected User Pages

| Route | Page | Features |
|-------|------|----------|
| `/create` | **Create Blog** | Rich text editor, preview mode, tags input, draft/publish toggle |
| `/edit/:id` | **Edit Blog** | Edit existing blog with same features as create |
| `/dashboard` | **Dashboard** | Blog management table, stats cards, filter by status, analytics |

### Protected Admin Pages

| Route | Page | Features |
|-------|------|----------|
| `/admin` | **Admin Dashboard** | Stats cards, user growth chart, blog activity chart, recent activity |
| `/admin/users` | **Manage Users** | User table with search, ban/promote/delete actions, pagination |
| `/admin/blogs` | **Manage Blogs** | Blog table with approve/reject/delete actions, status filtering |
| `/admin/reports` | **Reports** | Flagged content list, report reasons, resolve/dismiss/remove actions |
| `/admin/settings` | **Settings** | General settings, moderation rules, maintenance mode configuration |

---

## 🔐 Authentication & Authorization

**Authentication Flow:**
1. User logs in/registers with email and password
2. Backend returns JWT token and user object
3. Token stored in localStorage
4. Token automatically added to all API requests via Axios interceptor
5. 401 responses trigger automatic logout and redirect to login

**Route Protection:**
- `ProtectedRoute` component wraps protected routes
- Checks `isAuthenticated` status
- Optionally enforces `requiredRole` (admin)
- Shows loading state while checking auth
- Redirects unauthorized users to home or login

**State Management:**
- `AuthContext` manages user, token, and auth methods
- `useAuth()` hook provides auth state to any component
- Persists auth state in localStorage across sessions

---

## 🎨 Component System

### Common Components

**Navbar**
- Logo with home link
- Search bar with form submission
- User dropdown menu (profile, dashboard, admin, logout)
- Theme toggle (light/dark mode)
- Mobile hamburger menu with responsive navigation

**Footer**
- Brand section with description
- Product, Company, Legal link sections
- Social media icons (Twitter, GitHub, LinkedIn, Email)
- Copyright notice

**Loader**
- Spinner component with optional text
- Card skeleton for blog previews
- Blog list skeleton with configurable count
- Blog detail skeleton for full page loading

**ProtectedRoute**
- Wraps routes requiring authentication
- Shows loading state while checking auth
- Redirects to login if not authenticated
- Enforces role-based access (admin only routes)

### Blog Components

**BlogCard**
- Blog title, excerpt, author info
- Publication date, like count, comment count
- Tag display (up to 3 with +N indicator)
- Hover effects with elevation
- Like button with heart icon
- Share button

**CommentSection**
- Comment form for authenticated users
- Comment list with author info and timestamps
- Like/delete actions on comments
- Relative time display (e.g., "2 hours ago")
- Empty state messaging

### Admin Components

**AdminSidebar**
- Collapsible navigation with toggle button
- Active route highlighting
- Dashboard, Users, Blogs, Reports, Settings links
- Back to site button
- Smooth collapse animation

**StatsCard**
- Title, large value display
- Icon with background color
- Trend indicator (up/down with percentage)
- Optional description text
- Hover effects

**DataTable**
- Configurable columns with custom rendering
- Row selection with checkbox
- Action dropdown menu per row
- Pagination controls
- Loading and empty states
- Responsive design

---

## 🔌 API Integration

### API Service Structure

**Base Configuration:**
- Base URL: `http://localhost:3001/api` (configurable via `VITE_API_URL`)
- Axios instance with request/response interceptors
- Automatic JWT token injection in Authorization header
- 401 response handling (logout + redirect)

**API Endpoints:**

```typescript
// Auth
POST /auth/login
POST /auth/register
POST /auth/logout
GET /auth/me

// Blogs
GET /blogs?page=1&limit=10&search=query
GET /blogs/:id
POST /blogs
PUT /blogs/:id
DELETE /blogs/:id
POST /blogs/:id/publish
POST /blogs/:id/like
DELETE /blogs/:id/like
GET /users/:userId/blogs

// Comments
GET /blogs/:blogId/comments?page=1&limit=20
POST /blogs/:blogId/comments
DELETE /comments/:commentId
POST /comments/:commentId/like

// Users
GET /users/:userId
PUT /users/profile
GET /users/following/blogs
POST /users/:userId/follow
DELETE /users/:userId/follow
GET /users/trending

// Admin
GET /admin/stats
GET /admin/users?page=1&limit=20&search=query
PUT /admin/users/:userId/role
POST /admin/users/:userId/ban
POST /admin/users/:userId/unban
DELETE /admin/users/:userId
GET /admin/blogs?page=1&limit=20&status=pending
POST /admin/blogs/:blogId/approve
POST /admin/blogs/:blogId/reject
DELETE /admin/blogs/:blogId
GET /admin/reports?page=1&limit=20
POST /admin/reports/:reportId/resolve
GET /admin/settings
PUT /admin/settings

// Analytics
GET /analytics/blogs/:blogId
GET /analytics/user
GET /admin/analytics?period=30d
```

---

## 🎯 Key Features Implemented

### User Features
✅ User authentication (login/register)
✅ Blog creation with rich text editor
✅ Blog editing and publishing
✅ Blog discovery and search
✅ Like and bookmark blogs
✅ Comment system with threading
✅ User profiles with stats
✅ Follow/unfollow users
✅ Personal dashboard with analytics
✅ Responsive mobile design

### Admin Features
✅ Admin dashboard with charts
✅ User management (ban, promote, delete)
✅ Blog moderation (approve, reject, delete)
✅ Content reports and moderation
✅ Platform settings configuration
✅ Analytics and statistics
✅ Maintenance mode

### Design Features
✅ Light and dark mode toggle
✅ Refined minimalist design
✅ Smooth animations and transitions
✅ Loading skeletons
✅ Error states and validation
✅ Toast notifications
✅ Responsive grid layouts
✅ Accessible component design

---

## 🚀 Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type checking
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

```env
VITE_API_URL=http://localhost:3001/api
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

---

## 📊 Design Tokens

### Colors (OKLCH Format)

**Light Mode:**
- Background: `#FFFFFF`
- Foreground: `#1E293B`
- Primary: `#0891B2`
- Secondary: `#F59E0B`
- Muted: `#F1F5F9`

**Dark Mode:**
- Background: `#0F172A`
- Foreground: `#F1F5F9`
- Primary: `#06B6D4`
- Secondary: `#FBBF24`
- Muted: `#334155`

### Typography

- **Display:** Geist (bold 700) - Headlines
- **Body:** Inter (regular 400, medium 500) - Content
- **Monospace:** Fira Code (400, 500) - Code blocks

### Spacing

8px base unit with 1.5x scaling: 8, 12, 16, 24, 32, 48, 64, 96px

### Border Radius

0.65rem base with variants: sm, md, lg, xl

---

## 🔄 State Management

### Context Providers

**AuthContext**
- Manages user login state
- Provides auth methods (login, register, logout)
- Persists to localStorage
- Auto-loads on app start

**ThemeContext**
- Manages light/dark mode
- Persists preference to localStorage
- Applies dark class to document root

---

## 📱 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Layout Patterns:**
- Home: 65/35 split (feed/sidebar)
- Blog Detail: Full-width centered content
- Admin: Sidebar + main content
- Profile: 35/65 split (sidebar/content)

---

## ✨ Animation Guidelines

- **Page Transitions:** Fade-in (200ms ease-out)
- **Modal Entrance:** Scale + fade (300ms cubic-bezier)
- **Hover Effects:** Color transition (150ms), shadow elevation (200ms)
- **Loading:** Smooth rotation (2s linear)
- **Form Validation:** Shake (100ms) for errors

---

## 🛠️ Development Workflow

1. **Components:** Build reusable components in `components/`
2. **Pages:** Create page-level components in `pages/`
3. **Styling:** Use Tailwind utilities and design tokens
4. **API:** Call endpoints via `api.ts` service
5. **State:** Use Context API for global state
6. **Types:** Leverage TypeScript for type safety

---

## 📝 Notes for Backend Integration

- Mock data is used throughout for demonstration
- Replace API calls in `services/api.ts` with actual endpoints
- Implement proper error handling for API failures
- Add request/response logging for debugging
- Consider adding request retry logic
- Implement proper token refresh mechanism
- Add request timeout handling

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Wouter Router](https://github.com/molefrog/wouter)
- [Axios Documentation](https://axios-http.com)

---

## 📄 License

MIT License - Feel free to use this template for your projects.
