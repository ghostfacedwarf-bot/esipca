# 🚀 Esipca Metalica - Quick Start Guide

## ✅ Current Status

**✓ Project Setup Complete**
- ✅ All dependencies installed
- ✅ Development server running
- ✅ Frontend accessible at **http://localhost:3002**
- ✅ Prisma client generated
- ⏳ Database setup pending

## 🌐 Access Your Site

**Frontend:** http://localhost:3002

The homepage is fully functional with:
- ✅ Hero section with CTA buttons
- ✅ Product categories
- ✅ Featured products showcase
- ✅ Trust signals section
- ✅ Newsletter subscription
- ✅ Footer with contact info

**Note:** Product pages will show empty results until database is configured.

---

## 🗄️ Database Setup (REQUIRED)

Your site is running, but needs a PostgreSQL database to store products, orders, and customer data.

### **Option 1: Cloud PostgreSQL (Easiest - FREE)**

#### Supabase (Recommended - Free tier includes PostgreSQL)
1. Go to https://supabase.com
2. Sign up (free account)
3. Create a new project (gives you free PostgreSQL database)
4. Copy the connection string from Project Settings > Database
5. Paste into `.env.local` → `DATABASE_URL`
6. Run: `pnpm db:push` and `pnpm db:seed`

**Connection string format:**
```
postgresql://postgres:[PASSWORD]@db.[REFERENCE].supabase.co:5432/postgres
```

#### Railway.app (Alternative - Free tier)
1. Go to https://railway.app
2. Sign up (free account)
3. Create PostgreSQL service
4. Copy connection string
5. Paste into `.env.local` → `DATABASE_URL`
6. Run: `pnpm db:push` and `pnpm db:seed`

---

### **Option 2: Local PostgreSQL**

If you have PostgreSQL installed locally:

1. Create database:
```bash
psql -U postgres -c "CREATE DATABASE esipcametalica;"
```

2. Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/esipcametalica"
```

3. Initialize database:
```bash
cd C:\Users\MARIA\esipcametalica-next
pnpm db:push
pnpm db:seed
```

---

## 📋 Setup Checklist

```
Database Setup:
- [ ] Choose database option (Supabase / Railway / Local PostgreSQL)
- [ ] Get PostgreSQL connection string
- [ ] Update DATABASE_URL in .env.local
- [ ] Run: pnpm db:push
- [ ] Run: pnpm db:seed

Verify Setup:
- [ ] Visit http://localhost:3002/produse (should see 3 sample products)
- [ ] View product details by clicking on a product
- [ ] Try contact form at http://localhost:3002/contact
- [ ] Run: pnpm db:studio (to inspect database)
```

---

## 📊 Sample Data

Once database is set up, you'll have:
- ✅ 3 product categories
- ✅ 3 sample products with variants
- ✅ Admin user: `admin@esipcametalica.ro` / `admin123`
- ✅ Sample customer reviews

---

## 🎯 Next Steps After Database Setup

### 1. Verify Database
```bash
pnpm db:studio  # Opens Prisma Studio at http://localhost:5555
```

### 2. Test Product Pages
- Homepage: http://localhost:3002
- Products: http://localhost:3002/produse
- Product Detail: http://localhost:3002/produse/sipca-metalica-p1-negru
- Contact: http://localhost:3002/contact

### 3. Add More Products
Use Prisma Studio to add products manually, or:
- Modify `prisma/seed.ts` to add more sample data
- Run: `pnpm db:seed` again (will reset database)

### 4. Production Deployment
When ready to deploy:
```bash
# Build for production
pnpm build

# Deploy to Vercel (easiest for Next.js)
vercel
```

---

## 📁 Important Files

```
C:\Users\MARIA\esipcametalica-next\
├── .env.local              ← EDIT: Add your DATABASE_URL here
├── app/page.tsx            ← Homepage
├── app/produse/            ← Product pages
├── prisma/schema.prisma    ← Database schema
├── prisma/seed.ts          ← Sample data
└── README.md               ← Full documentation
```

---

## 🔑 Environment Variables

Update `.env.local` with your actual values:

```env
# Database - REQUIRED
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth - Already configured with demo secret
NEXTAUTH_SECRET="supersecretkey12345678901234567890"
NEXTAUTH_URL="http://localhost:3002"

# Email - Optional (for contact form)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

## 🆘 Troubleshooting

### "Cannot find module '@tailwindcss/forms'"
**Solution:** Already fixed! Just reload the page.

### "database connection refused"
**Solution:**
1. Check DATABASE_URL in .env.local
2. Verify PostgreSQL service is running
3. Test connection: `psql $DATABASE_URL`

### "Port 3002 already in use"
**Solution:**
```bash
# Use different port
PORT=3003 pnpm dev
```

### "Products page shows empty"
**Solution:** Database not set up yet. Follow database setup steps above.

---

## 📞 Support

- **Full docs:** `C:\Users\MARIA\esipcametalica-next\README.md`
- **Prisma docs:** https://www.prisma.io/docs/
- **Next.js docs:** https://nextjs.org/docs
- **Supabase docs:** https://supabase.com/docs

---

## 🎉 You're Ready!

Your e-commerce platform is built and running. Just add a database and you're live!

**Next:** Choose a database option above and complete the setup. Takes ~5 minutes for Supabase!

Last updated: December 2025
