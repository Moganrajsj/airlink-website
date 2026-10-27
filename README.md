# 🚀 Airlink Broadband - Premium ISP Website

A **Starlink-level premium broadband website** for **Sriram Broadband Services Private Limited (Airlink Broadband)** built with Next.js, Three.js, and GSAP animations.

## ✨ Features

### 🎨 **Premium Design**
- **Yellow, White, Black** futuristic theme
- **Glassmorphism UI** with backdrop blur effects
- **3D Fiber Network Animation** using Three.js
- **Smooth GSAP Animations** with parallax scrolling
- **Cinematic Page Transitions**
- **Responsive Design** - Mobile, Tablet, Desktop

### 📄 **Pages Implemented**

1. **Home** (/) - Hero with 3D animation, featured plans, infrastructure showcase
2. **Residential Plans** (/residential) - Home internet plans with OTT subscriptions
3. **Business Solutions** (/business) - Enterprise ILL, SD-WAN, Cloud Connect
4. **Plans & Pricing** (/plans) - Interactive comparison with toggle switcher
5. **Coverage Checker** (/coverage) - Check service availability
6. **About** (/about) - Company information
7. **Contact** (/contact) - WhatsApp & Gmail integration
8. **Customer Portal** (/portal) - User dashboard with billing & usage
9. **Admin Dashboard** (/admin) - Billing management & customer control

### 🔐 **Authentication System**
- Email/Password authentication
- Role-based access (Customer & Admin)
- Demo accounts:
  - **Admin**: `admin@airlink.com` / `admin123`
  - **Customer**: `customer@test.com` / `test123`
- Persistent login with localStorage
- Protected routes for portal and admin

### 💳 **Admin Dashboard Features**
- **Customer Management** - View all customers in a table
- **Payment Tracking** - Mark customers as paid/unpaid
- **Billing Statistics** - Revenue tracking & analytics
- **Email Reminders** - Send payment reminders via Gmail
- **Real-time Updates** - Instant status changes

### 👤 **Customer Portal Features**
- **Account Overview** - Plan details & payment status
- **Data Usage** - Download/Upload visualization
- **Connection Status** - Live speed metrics
- **Quick Actions** - Upgrade plan, contact support, make payment
- **WhatsApp Support Integration**

### 📊 **Plan Management**
- **Residential Plans**:
  - Basic (50 Mbps) - ₹499/month
  - Premium (100 Mbps) - ₹799/month + 5 OTT apps
  - Ultra (200 Mbps) - ₹1,299/month + 10 OTT apps
  - Gigabit (1 Gbps) - ₹2,499/month + All OTT apps
  
- **Business Plans**:
  - Startup (100 Mbps ILL) - ₹2,999/month
  - Growth (200 Mbps ILL) - ₹5,999/month
  - Enterprise (500 Mbps ILL) - ₹12,999/month
  - Custom (Up to 10 Gbps) - Custom pricing

### 📞 **Contact Integration**
- **WhatsApp**: Pre-filled messages with plan inquiries
- **Gmail**: Formatted email templates for business quotes
- **Direct Links**: Contact buttons throughout the site

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling

### **3D & Animations**
- **Three.js** (`react-three-fiber`) - 3D graphics
- **@react-three/drei** - Three.js helpers
- **GSAP** - Professional animations
- **Framer Motion** - React animations

### **UI Components**
- **Lucide React** - Modern icon library
- **clsx** - Conditional class names

## 📁 **Project Structure**

```
airlink/
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── admin/                 # Admin Dashboard
│   │   │   ├── page.tsx
│   │   │   └── admin.module.css
│   │   ├── auth/                  # Login/Signup
│   │   │   ├── page.tsx
│   │   │   └── auth.module.css
│   │   ├── business/              # Business Solutions
│   │   │   ├── page.tsx
│   │   │   └── business.module.css
│   │   ├── contact/
│   │   ├── coverage/
│   │   ├── plans/                 # Plans & Pricing
│   │   │   ├── page.tsx
│   │   │   └── plans.module.css
│   │   ├── portal/                # Customer Portal
│   │   │   ├── page.tsx
│   │   │   └── portal.module.css
│   │   ├── residential/           # Residential Plans
│   │   │   ├── page.tsx
│   │   │   └── residential.module.css
│   │   ├── globals.css            # Global styles & animations
│   │   ├── layout.tsx             # Root layout with AuthProvider
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Navigation with auth
│   │   │   ├── Footer.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx           # 3D Hero section
│   │   │   └── Infrastructure.tsx
│   │   ├── three/
│   │   │   └── FiberGlobe.tsx     # 3D Fiber animation
│   │   └── ui/
│   │       └── PlanCard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx        # Authentication state
│   ├── data/
│   │   └── plans.ts               # All plan data
│   └── styles/
│       └── variables.css          # Design tokens
└── package.json
```

## 🚀 **Getting Started**

### **Installation**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **Access the Application**

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Demo Accounts**

**Admin Dashboard:**
```
Email: admin@airlink.com
Password: admin123
```

**Customer Portal:**
```
Email: customer@test.com
Password: test123
```

## 🎨 **Design System**

### **Colors**
- **Primary**: `#F5FF00` (Vibrant Yellow)
- **Background**: `#000000` (Black)
- **Surface**: `#111111`
- **Success**: `#00FF88`
- **Warning**: `#FFB800`
- **Error**: `#FF4444`
- **Info**: `#00D4FF`

### **Typography**
- **Font Family**: Outfit (Google Fonts)
- **Font Weights**: 300-800
- **Font Sizes**: 0.75rem - 4.5rem (responsive)

### **Spacing System**
- xs: 8px, sm: 12px, md: 16px, lg: 24px
- xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px, 5xl: 128px

### **Animations**
- fadeIn, slideInLeft, slideInRight
- pulse, glow, float, shimmer
- Custom easing: cubic-bezier curves

## 📱 **Responsive Breakpoints**

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Container Max-Width**: 1400px

## 🔒 **Authentication Flow**

1. User visits `/auth` page
2. Login or signup with email/password
3. Auth state stored in Context + localStorage
4. Role-based redirect:
   - Admin → `/admin`
   - Customer → `/portal`
5. Protected routes check authentication
6. Navbar shows Login/Portal/Admin based on state

## 💼 **Admin Workflow**

1. Login as admin
2. View dashboard with statistics:
   - Total customers
   - Paid vs unpaid count
   - Monthly revenue & pending amounts
3. Manage customers in table:
   - Toggle payment status (Paid/Unpaid)
   - Send email reminders to unpaid customers
4. All changes persist in localStorage

## 🎯 **Key Features**

### **3D Animations** 
- Fiber globe with interactive rotation
- Node-based network visualization
- Mouse parallax effects
- Auto-rotating orbital rings

### **GSAP Scroll Animations**
- Character-by-character text animations
- Parallax scrolling sections
- Scroll-triggered reveals

### **Glassmorphism**
- Backdrop blur effects
- Semi-transparent panels
- Layered depth with shadows

### **WhatsApp Integration**
```javascript
// Example: Send plan inquiry
const message = encodeURIComponent("I'm interested in Premium plan");
window.open(`https://wa.me/919677402451?text=${message}`, '_blank');
```

### **Gmail Integration**
```javascript
// Example: Business quote request
const subject = encodeURIComponent('Business Solutions Inquiry');
const body = encodeURIComponent('Company details...');
window.open(`mailto:contact@airlink.com?subject=${subject}&body=${body}`);
```

## 🤖 **AI Sales Assistant**

The public site ships with "Airlink AI", a grounded sales assistant that recommends plans, explains OTT benefits and checks coverage, then hands buying-intent visitors to your team.

- **Grounded answers** - the model may only use active plans and coverage from the database (with the static catalogue as fallback), so prices and speeds stay accurate.
- **Lead capture** - the "Talk to an expert" form writes to the existing `Lead` table with `source: "ai_assistant"`, transcript attached, and triggers the usual email notification.
- **Streaming replies** - token-by-token responses with quick-start suggestions.
- **Bilingual** - replies in English, Tamil or Tanglish based on the visitor's language.
- **Guarded** - 25 messages per IP per 10 minutes, input validation, and no collection of Aadhaar, card or banking details.
- **Graceful fallback** - if no API key is set, the widget offers WhatsApp and phone instead of failing.

### **Setup**

1. Add the AI variables to `.env` (see `.env.example`):

```bash
# Groq (recommended — create a key at https://console.groq.com/keys)
AI_API_KEY=gsk_...
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=openai/gpt-oss-20b

# Stronger reasoning:  AI_MODEL=openai/gpt-oss-120b
# Multilingual/Tamil:  AI_MODEL=qwen/qwen3.8-27b
#
# ...or OpenRouter
# AI_BASE_URL=https://openrouter.ai/api/v1
# AI_MODEL=openai/gpt-4o-mini
```

`GROQ_API_KEY` is also accepted as an alias for `AI_API_KEY`. Use `.env.local` for local development and your host's environment panel for production, then restart the server.

2. The assistant appears on all public pages (not on `/admin`, `/auth` or `/portal`).

### **Key files**

- `src/components/ai/AiAssistant.tsx` - chat widget and callback form
- `src/app/api/ai/assistant/route.ts` - streaming endpoint, validation, rate limiting
- `src/lib/ai.ts` - provider-agnostic OpenAI-compatible client
- `src/lib/ai-knowledge.ts` - builds the grounded system prompt from plans and coverage

### **AI lead intelligence (admin)**
Every new lead is scored 0-100 and shown in `/admin/leads` and on the dashboard.

- **Rules first, always free:** `src/lib/lead-scoring.ts` scores contactability, coverage
  status, interest, source, message strength, freshness, duplicates and spam signals.
  It records the reasons for every point, so admins can see why a lead scored 82.
- **Optional free-model summary:** `src/lib/ai-leads.ts` asks a free Groq model for a
  one-line summary, intent, recommended plan and next action. Phone numbers and emails
  are never sent. If the model is rate-limited or the daily quota is gone, the lead keeps
  its rule-based score and is retried later (`aiStatus = heuristic`).
- **One admin email per lead:** sent after the response (`after()`), so the public form
  stays instant. Hot leads (70+) get an urgent subject, the AI summary, a call button and
  a deep link into the admin panel. Recipients come from `LEAD_NOTIFY_EMAILS`, then
  `MAIL_TO`.
- **Quota guard:** `src/lib/ai-usage.ts` stores a daily counter in the `AiUsage` table, so
  restarts and multiple Passenger processes share the same free-tier budget.

Relevant env vars (see `.env.example`):

```bash
AI_LEAD_SCORING_ENABLED=true
AI_MODEL_FALLBACKS=openai/gpt-oss-120b,qwen/qwen3.8-27b
AI_SCORE_DAILY_LIMIT=150
AI_ENRICH_MIN_SCORE=40
LEAD_NOTIFY_EMAILS=
```

If delivery fails with `Hostname/IP does not match certificate's altnames` (common on
GoDaddy/cPanel mail), set `SMTP_TLS_SERVERNAME` to the name printed in the certificate
(for example `prod.sin2.secureserver.net`). This keeps TLS verification enabled; never
fix this by setting `rejectUnauthorized: false`.

In `/admin/leads` you can filter by score tier, sort by score, expand a lead for the AI
detail and press **Re-score with AI**. **Score new leads** backfills the backlog in small
batches using the same daily quota.

## 📈 **Future Enhancements**

- [ ] Real backend API integration
- [ ] Online payment gateway (Razorpay/Stripe)
- [ ] Advanced analytics dashboard
- [ ] Live chat support
- [ ] Customer ticket system
- [ ] Email notifications
- [ ] Network speed test tool
- [ ] Service location map
- [ ] Blog/Resources section

## 🎓 **Learning Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GSAP Documentation](https://greensock.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)

---

## Lead pipeline, AI assistant and admin intelligence

The site includes a hardened lead pipeline and an admin intelligence panel built
on the existing `Lead` table (no parallel database).

- Public forms validate on the server, normalise `+91` phone numbers, flag
  (never reject) suspicious names, detect duplicates, and record bot-risk
  signals. Suspicious leads are stored for review; nothing is silently deleted.
- Every lead gets a deterministic, explainable quality score plus a separate
  spam-risk score. A free Groq model adds a summary and next action when the
  daily quota allows it, in observation mode only.
- `/admin/intelligence` shows real database metrics, a review workflow, duplicate
  management and business questions answered from live queries.
- `/admin/knowledge` lets admins edit the assistant's approved answers without
  a code change.

### Documentation

| Document | Contents |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Request flow, modules, scoring, data model, retention |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Env vars, GoDaddy/cPanel steps, cron, smoke test, rollback |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Threat model, authz matrix, PII handling, residual risks |
| [`docs/TEST-REPORT.md`](docs/TEST-REPORT.md) | Unit/integration results, live smoke test, gaps |

### Tests

```bash
npm test                   # unit tests
npm run test:integration   # real-database intake tests (see docs/TEST-REPORT.md)
```

> The demo credentials listed earlier in this file belong to the legacy customer
> portal seed data. They must not be used for the admin panel, and should be
> removed from any production deployment.

## 📄 **License**

© 2026 Sriram Broadband Services Private Limited. All rights reserved.

---

**Built with MJ WEB DESIGNS ❤️ **
