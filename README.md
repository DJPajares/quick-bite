# Quick Bite

A modern restaurant ordering application built with Next.js 16, featuring both customer-facing and admin dashboard functionality.

## Features

### Customer Features

- Browse menu with search and category filtering
- Add items to cart with quantity controls
- Submit orders and track status
- Multi-language support (17 languages)
- Dark/light theme
- Responsive design for mobile and desktop

### Admin Features

- Dashboard with real-time analytics
- Order management with status updates
- Menu CRUD operations
- Inventory tracking
- Secure authentication with NextAuth.js
- Auto-refresh with polling (30s for orders, 60s for dashboard)
- Fully responsive admin interface

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI (Radix UI)
- **Authentication:** NextAuth.js v5
- **Forms:** React Hook Form + Zod
- **Internationalization:** next-intl (17 languages)
- **API Client:** Axios
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

4. Generate admin password hash:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

5. Update `.env.local` with your credentials and configuration.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$...  # Generated with bcrypt

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Admin Access

Navigate to `/admin/login` and sign in with your configured admin credentials.

## Backend API Requirements

The application expects the following API endpoints to be implemented on the backend:

### Customer Endpoints

#### Menu

- `GET /api/menu` - Get all menu items
- Response: `{ success: boolean, data: MenuItem[], count: number }`

#### Cart

- `GET /api/cart/:sessionId` - Get cart for session
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart

#### Orders

- `POST /api/orders/submit` - Submit order
- `GET /api/bill/:sessionId` - Get bill for session

### Admin Endpoints (require authentication)

#### Orders Management

- `GET /api/admin/orders` - List all orders with optional filters (status, startDate, endDate)
- `GET /api/admin/orders/:id` - Get order details
- `PATCH /api/admin/orders/:id/status` - Update order status
  - Body: `{ status: string }`

#### Menu Management

- `GET /api/admin/menu` - List all menu items
- `POST /api/admin/menu` - Create menu item
  - Body: `CreateMenuItemRequest`
- `PATCH /api/admin/menu/:id` - Update menu item
  - Body: `UpdateMenuItemRequest`
- `DELETE /api/admin/menu/:id` - Delete menu item

#### Inventory

- `GET /api/admin/inventory` - List all inventory items
- `PATCH /api/admin/inventory/:id` - Update inventory stock level
  - Body: `{ stockLevel: number }`

#### Analytics

- `GET /api/admin/analytics/dashboard` - Get dashboard analytics
  - Returns: total orders, revenue, average order value, today's stats, popular items, recent orders

### Data Models

See `types/api.ts` for complete TypeScript interfaces for all request/response types.

### Authentication

Admin endpoints should verify the `Authorization: Bearer <token>` header and ensure the user has admin role.

## Project Structure

```
app/
├── (admin)/          # Admin route group (protected)
├── (main)/           # Customer route group
├── admin/
│   └── login/        # Admin login page
└── api/
    └── auth/         # NextAuth API routes

components/
├── admin/            # Admin-specific components
├── desktop/          # Desktop navigation
├── mobile/           # Mobile navigation
├── shared/           # Shared components
└── ui/               # Base UI components

lib/
├── api.ts            # API client and functions
├── auth.ts           # NextAuth configuration
└── session.ts        # Session management

types/
└── api.ts            # TypeScript type definitions
```

## Testing

```bash
pnpm test              # Run tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

## Internationalization

The app supports 17 languages. Translations are in `messages/*.json`. To add a new language:

1. Add language config to `i18n/config.ts`
2. Create `messages/<locale>.json` with translations
3. Language switcher will automatically include it

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
