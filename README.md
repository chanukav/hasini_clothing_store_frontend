# Hasini Clothing Store - Frontend Web Application

The customer storefront and administrative management application for **Hasini Clothing Store**, built with React 19, Vite, and Tailwind CSS.

---

## Technologies Used
- **React 19 & Vite 8**: Modern client-side SPA with lightning-fast HMR.
- **Tailwind CSS v4**: Utility-first styling with responsive, accessible layout primitives.
- **React Router DOM v7**: Route hierarchies with distinct customer and administrative layouts.
- **React Hook Form & Zod**: Form handling and strict client-side validation.
- **Supabase Storage**: Direct client image upload to Supabase CDN bucket for product media.
- **Axios**: Configured HTTP client with authorization interceptors.
- **Lucide React**: Clean UI iconography.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set the environment variables:
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_BUCKET_ID=hasani_clothing_products_images
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## Application Structure
- `src/layouts/`: Customer and Admin layout shells (headers, footers, navigation).
- `src/pages/`: Public pages (Home, Shop, ProductDetail, Cart, Checkout, OrderConfirmation) and Admin pages (Dashboard, Orders, Products, Customers, Categories, Settings).
- `src/context/`: `AuthContext` (JWT session management) and `CartContext` (cart state & persistent storage).
- `src/utils/`: WhatsApp order message generator, formatters, and helpers.

For full architecture, database design, backend setup, and deployment instructions, refer to the [Backend README](file:///d:/hasani_clothing_web/hasini_clothing_store_backend/README.md).
