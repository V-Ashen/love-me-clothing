https://love-me-clothing-web.vercel.app/

# Love Me Clothing | E-Commerce Platform

A premium, ultra-modern dark-themed e-commerce platform built for **Love Me Clothing**. This project features a fully functional customer storefront and an administrative dashboard to manage the entire online business.

##  Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 (Custom Glassmorphism & Dark Theme)
- **Database & Auth:** Firebase (Firestore, Authentication, Storage)
- **State Management:** Zustand
- **Monorepo Management:** Turborepo

##  Project Structure

This project is structured as a monorepo containing multiple applications and shared packages:

- **`apps/web`**: The main customer-facing storefront. Features include product browsing, product details, a dynamic side-cart, wishlists, user authentication, and order tracking.
- **`apps/admin`**: The administrative dashboard. Allows staff to manage inventory, track and update order statuses, view customer data, and analyze sales.
- **`packages/shared`**: Shared codebase containing global TypeScript interfaces (`Product`, `Order`, `User`), Firebase configuration, and shared utilities to ensure consistency across web and admin apps.

##  Key Features

### Storefront (`apps/web`)
- **Premium Dark Aesthetic:** A cohesive, sleek dark design (`#0a0a0a`) with frosted glassmorphism elements (`backdrop-blur`) and gold brand accents.
- **Dynamic Catalog:** Browse new arrivals, filter products by category, and paginate through the shop.
- **Product Pages:** View high-quality images, select variations (size, color), and check live stock availability.
- **User Accounts:** Secure registration/login to maintain wishlists and track order history.
- **Checkout Flow:** Support for Cash on Delivery, Card, and Bank Transfer with a dummy slip upload interface.

### Admin Dashboard (`apps/admin`)
- **Analytics:** Overview of total sales, active orders, and revenue.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) capabilities for the clothing catalog.
- **Order Management:** View incoming orders and transition their status (Pending -> Processing -> Shipped -> Delivered).
- **Customer Directory:** Filterable list of registered users.

##  Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate into the project root:
   ```bash
   cd love-me-clothing
   ```

2. Install the dependencies for the entire monorepo:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Ensure you have a `.env.local` file in both `apps/web` and `apps/admin` containing your Firebase configuration keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Running the Project

To start the development servers for both the web storefront and the admin panel simultaneously:

```bash
npm run dev
```

- The **Storefront** will be available at `http://localhost:3000`
- The **Admin Panel** will be available at `http://localhost:3001` (or whichever port is automatically assigned).

### Building for Production

To build all apps for production deployment:

```bash
npm run build
```

---

*Designed and developed specifically for Love Me Clothing.*
