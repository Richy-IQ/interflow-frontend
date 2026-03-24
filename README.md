# Interflow Frontend

React 18 frontend for the Interflow creative industry platform. Connects to the Django REST API backend.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Routing | React Router DOM v6 |
| State | Zustand (with localStorage persist) |
| HTTP | Axios (with JWT interceptor + auto-refresh) |
| Forms | React Hook Form |
| Toasts | React Hot Toast |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set REACT_APP_API_URL if backend is not on localhost:8000

# 3. Start development server
npm start
```

Runs on `http://localhost:3000`.

The `"proxy": "http://localhost:8000"` in `package.json` proxies all `/api/v1` requests to the Django backend automatically in development — no CORS issues.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `/api/v1` | Backend API base URL |

## Project Structure

```
src/
├── App.js                          # Router + route guards
├── index.css                       # Global design system (CSS variables)
├── index.js                        # React root
│
├── services/
│   └── api.js                      # All API calls (axios, JWT interceptor)
│
├── store/
│   └── authStore.js                # Zustand auth state
│
├── components/
│   ├── auth/
│   │   ├── Auth.css
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx        # Role select → Signup → OTP → Congrats
│   │   └── ForgotPasswordPage.jsx
│   │
│   ├── landing/
│   │   ├── Landing.css
│   │   └── LandingPage.jsx         # Full marketing page
│   │
│   ├── common/
│   │   ├── Layout.css
│   │   └── DashboardLayout.jsx     # Sidebar + topbar shell
│   │
│   └── onboarding/
│       └── Onboarding.css
│
└── pages/
    ├── ArtistOnboarding.jsx        # 5-step onboarding
    ├── OrgOnboarding.jsx           # 4-step onboarding
    ├── ArtistDashboard.jsx         # Stats + feed
    ├── OrgDashboard.jsx            # Org stats + actions
    ├── PortfolioPage.jsx           # Profile tabs (bio/media/career)
    ├── NetworkPage.jsx             # Discover / connections / requests
    ├── OpportunitiesPage.jsx       # Browse & apply
    ├── ApplicationsPage.jsx        # My applications
    ├── OrgOpportunitiesPage.jsx    # Create & manage opportunities
    ├── OrgApplicationsPage.jsx     # Review applicants
    ├── NotificationsPage.jsx       # In-app notifications
    ├── SharePortfolioPage.jsx      # Share portfolio link
    ├── SettingsPage.jsx            # Profile/notifs/privacy/2FA/account
    ├── SupportPage.jsx             # Submit & track support tickets
    └── PublicPortfolioPage.jsx     # Public (no auth) portfolio view
```

## Pages & Routes

| Route | Component | Auth |
|---|---|---|
| `/` | LandingPage | Public |
| `/register` | RegisterPage | Public only |
| `/login` | LoginPage | Public only |
| `/forgot-password` | ForgotPasswordPage | Public |
| `/portfolio/public/:token` | PublicPortfolioPage | Public |
| `/onboarding/artist` | ArtistOnboarding | Private |
| `/onboarding/organization` | OrgOnboarding | Private |
| `/dashboard` | ArtistDashboard | Private |
| `/portfolio` | PortfolioPage | Private |
| `/portfolio/share` | SharePortfolioPage | Private |
| `/network` | NetworkPage | Private |
| `/opportunities` | OpportunitiesPage | Private |
| `/applications` | ApplicationsPage | Private |
| `/notifications` | NotificationsPage | Private |
| `/org/dashboard` | OrgDashboard | Private |
| `/org/opportunities` | OrgOpportunitiesPage | Private |
| `/org/applications` | OrgApplicationsPage | Private |
| `/settings` | SettingsPage | Private |
| `/support` | SupportPage | Private |

## Auth Flow

```
Register (role select) → Sign Up → OTP Verify → Congratulations
  → Artist: /onboarding/artist (5 steps) → /dashboard
  → Org:    /onboarding/organization (4 steps) → /org/dashboard

Login → role check → dashboard (if onboarded) or onboarding (if not)
```

JWT tokens are stored in localStorage. The Axios interceptor automatically:
1. Attaches the access token to every request
2. Refreshes the access token silently when it expires (401 → refresh → retry)
3. Redirects to `/login` if refresh also fails

## Building for Production

```bash
npm run build
```

Outputs to `/build`. Serve with any static host (Vercel, Netlify, Nginx).

## Connecting to Production Backend

Set in `.env`:
```
REACT_APP_API_URL=https://your-api-domain.com/api/v1
```

Remove the `"proxy"` line from `package.json` for production builds.
