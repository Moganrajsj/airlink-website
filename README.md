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

## 📄 **License**

© 2026 Sriram Broadband Services Private Limited. All rights reserved.

---

**Built with ❤️ by Antigravity AI**
