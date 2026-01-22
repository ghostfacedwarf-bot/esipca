# 🚀 Migration Guide: Local → Production

## Smart Approach: Use Same Database for Dev & Production

**The Best Practice:** Use Supabase (or Railway) for **both development AND production**. This way:
- ✅ No data loss during migration
- ✅ Same database system locally and in production
- ✅ Easy backups and exports
- ✅ Zero downtime deployment

---

## 🎯 Recommended Workflow

### Phase 1: Development (Weeks 1-3)
```
Local Machine
    ↓
Supabase Project #1 (Free Tier)
    ↓
    ├─ Create products
    ├─ Test features
    ├─ Build functionality
    └─ Seed with data
```

### Phase 2: Production (When Ready)
```
Supabase Project #1 (Free Tier)
    ↓ (SAME connection string)
    ↓
Production Deployment (Vercel)
    ↓
    └─ Scale up to paid tier if needed
```

**Result:** Zero migration needed! Your data flows seamlessly.

---

## Step-by-Step Setup

### 1. Create Supabase Account (5 minutes)

```
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with email/GitHub
4. Create organization (if prompted)
5. Create new project:
   - Name: "esipcametalica-dev"
   - Password: Create strong password
   - Region: Choose closest to you (e.g., Europe)
   - Pricing: Free tier
6. Wait ~2 minutes for database creation
```

### 2. Get Connection String

```
1. In Supabase Dashboard, go to: Project Settings (⚙️)
2. Click "Database" tab
3. Scroll to "Connection strings"
4. Select "Pooling Mode" (for best performance)
5. Copy entire connection string
6. Format: postgresql://postgres:[PASSWORD]@db.[REFERENCE].supabase.co:5432/postgres
```

### 3. Add to .env.local

```bash
# Edit: C:\Users\MARIA\esipcametalica-next\.env.local

# Replace this line:
DATABASE_URL="postgresql://postgres:example_password@db.example.supabase.co:5432/postgres"

# With your actual connection string from Supabase
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REFERENCE.supabase.co:5432/postgres"
```

### 4. Initialize Database

```bash
cd C:\Users\MARIA\esipcametalica-next

# Create schema
pnpm db:push

# Seed sample data
pnpm db:seed

# View database
pnpm db:studio
```

### 5. Verify It Works

```bash
# Start dev server
pnpm dev

# Visit:
# http://localhost:3002/produse (should see 3 sample products)
# http://localhost:3002/produse/sipca-metalica-p1-negru (product detail)
```

---

## 📊 Data Export/Backup

### Export Data from Supabase

**Option 1: Automatic Backups** (Built-in)
- Supabase automatically backs up daily
- Stored in Supabase dashboard

**Option 2: Manual Export** (SQL dump)
```bash
# Connect to Supabase and export database
# In Supabase Dashboard:
1. Go to SQL Editor
2. Create new query
3. Run: SELECT * FROM "User";
4. Copy results
5. Save as backup.sql
```

**Option 3: Prisma Export**
```bash
# Export data as JSON
pnpm exec prisma db execute --stdin <<EOF
SELECT * FROM "Product";
EOF
```

### Restore Data (If Needed)

```bash
# If database gets corrupted:

# 1. Delete and recreate:
pnpm db:push --skip-generate

# 2. Re-seed:
pnpm db:seed

# Or import from backup:
pnpm exec prisma db execute < backup.sql
```

---

## 🚀 Deploying to Production

### When You're Ready to Go Live:

```bash
# 1. Create PRODUCTION project on Supabase
#    (Or upgrade free tier to paid)

# 2. Get new connection string from production project

# 3. In Vercel/production environment, set:
#    DATABASE_URL = your_production_connection_string

# 4. Deploy to Vercel:
pnpm build
vercel

# 5. Vercel will automatically:
#    - Build your Next.js app
#    - Deploy to global CDN
#    - Set environment variables
#    - Start your server
```

### Production Vercel Setup:

```
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables:
   - DATABASE_URL = Production Supabase connection
   - NEXTAUTH_SECRET = Your secret key
4. Vercel auto-deploys on git push
```

---

## 📈 Scaling Plan

### As You Grow:

**Phase 1: Free Tier (Start Here)**
- Supabase Free: 500 MB storage
- Good for: Development & testing
- Cost: $0/month

**Phase 2: Pro Tier (When Growing)**
- Supabase Pro: 8 GB storage + performance
- Good for: Production with real users
- Cost: ~$25/month

**Phase 3: Enterprise (If Massive)**
- Contact Supabase for custom plan
- Dedicated resources
- Cost: Custom pricing

**Upgrade Path:**
```
Free Tier (Dev)
    ↓
Pro Tier (Production)
    ↓
Enterprise (Scale)

No data migration needed! Just change plan.
```

---

## 🔄 Backup & Recovery Strategy

### Automated Backups (Included)
- Supabase: Daily automatic backups
- Retention: 7 days (free tier), 30+ days (paid)
- Access: Dashboard > Backups tab

### Manual Backups (Recommended)

```bash
# Weekly backup script
# Create: backup.sh

#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/backup_$TIMESTAMP.sql
```

### Recovery

```bash
# Restore from backup
psql $DATABASE_URL < backups/backup_20250116_120000.sql
```

---

## 🛡️ Security Best Practices

### Connection String Security

```
✅ DO:
- Store DATABASE_URL in .env.local (never in git)
- Use Vercel environment variables for production
- Rotate password quarterly

❌ DON'T:
- Commit .env.local to GitHub
- Hardcode connection string
- Share connection string in chat/email
```

### Database Security

```
✅ Enable in Supabase:
1. Backups > Enable daily backups
2. Security > Enable database backups
3. SSL > Enforce SSL (for production)
4. Row Level Security (RLS) > Enable
```

---

## 📋 Migration Checklist

Before going live:

```
Development (Supabase Free Tier)
├─ ✅ Create Supabase account
├─ ✅ Get connection string
├─ ✅ Add to .env.local
├─ ✅ Run pnpm db:push
├─ ✅ Run pnpm db:seed
├─ ✅ Test locally (pnpm dev)
├─ ✅ Add all products/categories
├─ ✅ Test contact form
├─ ✅ Create backup

Production (Vercel + Supabase)
├─ ✅ Push code to GitHub
├─ ✅ Connect Vercel to GitHub
├─ ✅ Create/upgrade Supabase project
├─ ✅ Add DATABASE_URL to Vercel env
├─ ✅ Deploy to Vercel (vercel deploy)
├─ ✅ Test production URLs
├─ ✅ Setup custom domain
├─ ✅ Configure SSL (automatic)
├─ ✅ Setup monitoring/alerts
└─ ✅ Enable automatic backups

Post-Launch
├─ ✅ Monitor errors (Vercel dashboard)
├─ ✅ Track performance (Core Web Vitals)
├─ ✅ Weekly backups
└─ ✅ Monitor costs
```

---

## 🆘 Troubleshooting

### "Connection refused"
```
✅ Solution:
1. Check connection string in .env.local
2. Verify Supabase project is running
3. Ensure IP is whitelisted (Supabase does this automatically)
4. Test: psql $DATABASE_URL
```

### "Database doesn't have table..."
```
✅ Solution:
1. Delete .env file
2. Recreate .env with correct DATABASE_URL
3. Run: pnpm db:push
4. Run: pnpm db:seed
```

### "Out of storage on Supabase"
```
✅ Solution:
1. Export large tables to CSV
2. Archive old data
3. Upgrade to Pro tier (8 GB)
4. Delete old backups
```

### "Lost access to project"
```
✅ Solution:
1. Login to Supabase dashboard
2. Go to Project Settings > Database > Reset password
3. Get new connection string
4. Update in .env.local
5. No data is lost!
```

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Prisma Docs:** https://www.prisma.io/docs/
- **Vercel Docs:** https://vercel.com/docs
- **Database Backups:** https://supabase.com/docs/guides/database/backups

---

## Summary

**The Smart Way:**
```
Use Supabase for Development
    ↓
Same Connection String for Production
    ↓
No Migration Needed
    ↓
Deploy to Vercel
    ↓
Scale as needed (free → pro → enterprise)
```

**Time to Production:** ~30 minutes total
- Supabase setup: 5 min
- Database init: 5 min
- Add your data: 10 min
- Deploy to Vercel: 10 min

**Cost:** $0 initially (free tier), $25/month when scaling

---

Built to scale! 🚀

December 16, 2025
