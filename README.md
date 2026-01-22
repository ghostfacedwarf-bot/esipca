# Esipca Metalica - E-Commerce Platform

Production-grade e-commerce platform for metal products (šipcă metalică, tablă zincată, jgheaburi) built with Next.js 14, PostgreSQL, and Prisma.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, NextAuth for authentication
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: TailwindCSS + custom components
- **Validation**: Zod for schema validation
- **Email**: Nodemailer (configurable)
- **State**: Zustand for client-side state
- **Icons**: lucide-react, Heroicons

## Project Structure

```
esipcametalica-next/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── Header.tsx      # Navigation header
│   │   └── Footer.tsx      # Footer
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth routes
│   │   ├── products/       # Product endpoints
│   │   └── contact/        # Contact form endpoint
│   ├── produse/            # Product pages
│   │   ├── page.tsx        # Product listing
│   │   └── [slug]/         # Product details
│   ├── contact/            # Contact page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth config
│   └── utils/              # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding
├── public/                 # Static files
├── .env.example            # Environment variables template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # TailwindCSS config
├── next.config.js          # Next.js config
└── README.md              # This file
```

## Getting Started

### Prerequisites

- **Node.js** 18+ or **pnpm** 8+
- **PostgreSQL** 14+ (local or remote database)
- **Git**

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd esipcametalica-next

# Install dependencies
pnpm install

# Or with npm
npm install
```

### 2. Environment Setup

Create `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/esipcametalica"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (Optional - for contact forms)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@esipcametalica.ro"
ADMIN_EMAIL="admin@esipcametalica.ro"

# Company Info
NEXT_PUBLIC_COMPANY_NAME="Esipca Metalica"
NEXT_PUBLIC_COMPANY_PHONE="+40 (722) 292 519"
NEXT_PUBLIC_COMPANY_EMAIL="office@exprestrading.com"
```

### 3. Database Setup

```bash
# Create database schema
pnpm db:push

# Or with migrations
pnpm db:migrate

# Seed initial data (optional)
pnpm db:seed

# View database in Prisma Studio
pnpm db:studio
```

### 4. Start Development Server

```bash
# Start the development server
pnpm dev

# Or with npm
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 5. Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Database Schema

### Models

1. **User** - Admin users
   - id, email, password, name, role, createdAt, updatedAt

2. **Category** - Product categories
   - id, name, slug, description, image, parentId, sortOrder, isActive, createdAt, updatedAt

3. **Product** - Main products
   - id, name, slug, priceFrom, priceType (per_piece/per_meter), specs (JSON), isFeatured, isBestseller, isActive, createdAt, updatedAt
   - Relations: variants, media, reviews, category

4. **Variant** - Product variants (color, thickness, length combinations)
   - id, sku, attributes (JSON), price, stockStatus, stockQty, createdAt, updatedAt
   - Stores: color, thickness, length, finish, etc.

5. **Media** - Product images
   - id, url, alt, sortOrder, createdAt, updatedAt

6. **CartItem** - Shopping cart (session-based)
   - id, sessionId, productId, variantId, quantity, createdAt, updatedAt

7. **Order** - Customer orders
   - id, orderNumber, customerName, customerEmail, customerPhone, customerAddress, status, paymentMethod, createdAt, updatedAt

8. **OrderItem** - Order line items
   - id, orderId, productId, variantId, quantity, price, createdAt

9. **Review** - Product reviews
   - id, productId, name, email, rating, text, isApproved, createdAt, updatedAt

10. **Settings** - Global site settings
    - id, companyName, companyAddress, companyPhone, companyEmail, warrantyYears, deliveryDays, updatedAt

## Features

### Frontend

- ✅ Responsive design (mobile-first)
- ✅ Product catalog with filtering & sorting
- ✅ Product detail pages with variants
- ✅ Shopping cart (localStorage-based)
- ✅ Contact form
- ✅ Trust signals & testimonials section
- ✅ Newsletter signup
- ✅ SEO optimized (meta tags, OpenGraph, Schema.org)
- ✅ Fast performance (optimized images, lazy loading)

### Backend

- ✅ NextAuth authentication
- ✅ Product management API
- ✅ Category management
- ✅ Order submission & tracking
- ✅ Contact form handling
- ✅ Email notifications (Nodemailer)

### Admin Features (Future)

- Admin dashboard for CRUD operations
- Product image uploads
- CSV import for bulk products
- Order management & status tracking
- Review moderation
- Analytics & reports

## API Endpoints

### Products
- `GET /api/products` - Get all products with pagination
- `GET /api/products?categoryId=xxx` - Filter by category
- `GET /api/products?page=1&limit=12` - Pagination

### Authentication
- `POST /api/auth/signin` - Login (NextAuth)
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Contact
- `POST /api/contact` - Submit contact form

## Customization

### Colors

Edit `tailwind.config.ts`:
- Primary color: Red `#C0392B`
- Accent color: Green `#4FB68D`
- Dark color: Charcoal `#111827`

### Company Info

Edit `.env.local`:
```env
NEXT_PUBLIC_COMPANY_NAME="Your Company"
NEXT_PUBLIC_COMPANY_PHONE="+40..."
NEXT_PUBLIC_COMPANY_EMAIL="email@domain.ro"
```

### Email Configuration

For Gmail SMTP with App Password:
1. Enable 2-factor authentication in Gmail
2. Generate an "App Password"
3. Use as `SMTP_PASS` in `.env.local`

For SendGrid/Resend, update the implementation in `/api/contact`

## Deployment

### Vercel (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

### Railway

1. Create account at railway.app
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Docker

```bash
# Build image
docker build -t esipcametalica-next .

# Run container
docker run -p 3000:3000 esipcametalica-next
```

## Performance Optimization

- ✅ Image optimization (Next.js Image component)
- ✅ Server-side rendering for product pages (SSR/SSG)
- ✅ CSS minification & compression
- ✅ Font optimization
- ✅ Code splitting
- ✅ Lazy loading for images & components

## SEO

- ✅ Meta tags (title, description)
- ✅ OpenGraph tags (social media sharing)
- ✅ Schema.org structured data
- ✅ Sitemap.xml
- ✅ robots.txt
- ✅ Clean URLs & slugs
- ✅ Canonical URLs

## Security

- ✅ CSRF protection via NextAuth
- ✅ XSS prevention (React escaping)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Rate limiting on API routes
- ✅ Secure password hashing (bcryptjs)
- ✅ Environment variable isolation
- ✅ HTTPS enforcement (production)

## Troubleshooting

### Issue: Port 3000 already in use
```bash
# Use different port
PORT=3001 pnpm dev
```

### Issue: Database connection error
```bash
# Check DATABASE_URL in .env.local
# Verify PostgreSQL is running
# Test connection: psql $DATABASE_URL
```

### Issue: Images not loading
```bash
# Check CLOUDINARY_URL or image paths
# Verify next.config.js remotePatterns
```

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For issues and support, contact:
- 📧 Email: office@exprestrading.com
- 📞 Phone: +40 (722) 292 519
- 📍 Location: Galati, DN26 Nr 19, Romania

## Changelog

### v1.0.0 (Initial Release)
- Complete product catalog
- Contact form
- Product filtering & sorting
- Responsive design
- SEO optimization
- Trust signals
- Newsletter subscription

---

**Built with ❤️ for quality products**

Last updated: December 2025
