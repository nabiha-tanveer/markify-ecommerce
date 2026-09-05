# Markify — Multi-Vendor E-Commerce Platform

Markify is a full-stack multi-vendor e-commerce marketplace where multiple independent sellers can list and manage their own products, buyers can shop across all sellers in one place, and admins moderate the marketplace — all built on the MERN stack.

**Live Demo:** [markify-ecommerce.vercel.app](https://markify-ecommerce.vercel.app)
**Backend API:** Deployed on Railway
**Repository:** [github.com/nabiha-tanveer/markify-ecommerce](https://github.com/nabiha-tanveer/markify-ecommerce)

---

## Features

### Authentication & Roles
- JWT-based authentication with three distinct roles: **Buyer**, **Seller**, and **Admin**
- Role-based route protection and authorization middleware
- Sellers require admin approval before their shop goes live

### For Buyers
- Browse products with live search, category filters, and pagination
- Product detail pages with reviews and star ratings
- Shopping cart with quantity management
- Secure checkout with **Stripe** payment integration
- Order history with real-time order status tracking
- Wishlist to save favorite products

### For Sellers
- Seller dashboard with sales analytics (revenue, orders, units sold)
- Add products with multiple image uploads (via Cloudinary)
- Manage product inventory and stock levels
- Update order status (processing → shipped → delivered)

### For Admins
- Review and approve pending product listings before they go public
- Marketplace-wide moderation controls

### Platform-Wide
- Product reviews and ratings system
- Responsive, polished UI built with Tailwind CSS
- Image uploads handled through Cloudinary (no local file storage)

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- Stripe.js / React Stripe.js

**Backend**
- Node.js / Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer + Cloudinary for image uploads
- Stripe for payment processing

**Deployment**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

---

## Project Structure

```
multivendor-ecommerce/
├── backend/
│   ├── config/          # DB and Cloudinary configuration
│   ├── controllers/      # Route logic (auth, products, orders, etc.)
│   ├── middleware/       # Auth/authorization middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/           # Axios instance with auth interceptor
    │   ├── components/    # Reusable UI components
    │   ├── context/       # Auth context (global session state)
    │   └── pages/         # Route-level pages
    └── vite.config.js
```

---

## Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user (buyer/seller) |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/products` | List products (search, filter, paginate) |
| POST | `/api/products` | Seller creates a product (with image upload) |
| POST | `/api/orders` | Buyer places an order + creates Stripe PaymentIntent |
| PUT | `/api/orders/:id/confirm-payment` | Verify and confirm payment server-side |
| GET | `/api/seller/dashboard` | Seller's sales stats |
| PUT | `/api/admin/products/:id/approve` | Admin approves a pending product |
| POST | `/api/reviews` | Buyer submits a product review |
| POST | `/api/wishlist/toggle` | Add/remove product from wishlist |

---

## Getting Started Locally

### Backend
```bash
cd backend
npm install
# create a .env file with MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY,
# CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, PORT
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# create a .env file with VITE_STRIPE_PUBLISHABLE_KEY
npm run dev
```

---

## Notable Implementation Details

- **Payment security:** Card details are collected entirely by Stripe's `CardElement` and never touch our backend — only a PaymentIntent ID is stored. Payment success is always re-verified server-side before an order is marked as paid.
- **Multi-vendor cart/orders:** A single order can contain products from multiple sellers; each order item retains its own seller reference so sellers only see and manage orders relevant to them.
- **Image uploads:** Products support multiple images uploaded directly to Cloudinary via Multer, avoiding local disk storage entirely — production-safe for platforms with ephemeral filesystems.

---

Built as a full-stack learning project covering authentication, multi-role authorization, payments, file uploads, and production deployment.
