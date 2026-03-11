# 🚀 Airlink Broadband - Quick Start Guide

## Get Your Site Running in 3 Steps!

### Step 1: Navigate & Install
```bash
cd c:\Users\mogan\b2b-marketplace\airlink
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Visit: **http://localhost:3000**

---

## 🔐 Login Credentials

### Admin Access
- **URL**: http://localhost:3000/auth
- **Email**: `admin@airlink.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard with billing management

### Customer Access
- **URL**: http://localhost:3000/auth
- **Email**: `customer@test.com`
- **Password**: `test123`
- **Access**: Customer portal with usage stats

---

## 📍 Navigation Guide

### Main Pages
- **Home**: http://localhost:3000
- **Residential Plans**: http://localhost:3000/residential
- **Business Solutions**: http://localhost:3000/business
- **All Plans**: http://localhost:3000/plans
- **Coverage**: http://localhost:3000/coverage
- **About**: http://localhost:3000/about
- **Contact**: http://localhost:3000/contact

### Protected Pages (Require Login)
- **Customer Portal**: http://localhost:3000/portal
- **Admin Dashboard**: http://localhost:3000/admin

---

## 🎨 Key Features to Explore

### 1. **3D Hero Animation** 
Visit the home page and see the interactive fiber globe

### 2. **Plan Comparison**
Go to `/plans` and toggle between Residential & Business plans

### 3. **Admin Dashboard**
- Login as admin
- Mark customers as paid/unpaid
- Send email reminders
- View revenue statistics

### 4. **Customer Portal**
- Login as customer
- View your plan & billing status
- Check data usage
- Contact support via WhatsApp

### 5. **WhatsApp Integration**
- Contact buttons throughout the site
- Pre-filled messages for easy communication

---

## 🛠️ Troubleshooting

### Port Already in Use?
```bash
# Kill the existing process
npx kill-port 3000

# Then restart
npm run dev
```

### Build Errors?
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Try again
npm run dev
```

### Browser Not Updating?
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache

---

## 📞 Contact Information

**WhatsApp**: +91 9677402451
**Email**: contact@airlink.com

---

**Happy Browsing! 🚀**
