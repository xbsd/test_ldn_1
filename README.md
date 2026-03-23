# PedalArmor — E-Commerce for Guitar Processor Protectors

Full-stack e-commerce web application selling laser-cut acrylic protective covers for premium guitar multi-effects processors and amp modelers.

## Tech Stack

- **Backend**: Node.js + Express REST API
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React + Tailwind CSS (Vite)
- **Auth**: JWT (register / login / logout)
- **Payments**: Stripe test mode

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Stripe account (test mode keys)

## Installing PostgreSQL

PostgreSQL must be installed and running before you can use this application. The project does **not** include Docker or any automated database provisioning.

### macOS

```bash
brew install postgresql@14
brew services start postgresql@14
```

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows

Download and run the installer from https://www.postgresql.org/download/windows/. The installer includes pgAdmin and will start the service automatically.

### Create the database

After PostgreSQL is running, create the `pedalarmor` database:

```bash
# Switch to the postgres user (Linux) or use your superuser
sudo -u postgres psql

# Inside the psql prompt:
CREATE DATABASE pedalarmor;
CREATE USER pedalarmor_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pedalarmor TO pedalarmor_user;
\q
```

Then set your `DATABASE_URL` in `server/.env` to match:

```
DATABASE_URL="postgresql://pedalarmor_user:your_password@localhost:5432/pedalarmor"
```

> **Tip:** On macOS with Homebrew, the default superuser is your OS username with no password, so you can skip the `sudo -u postgres` prefix and connect directly with `psql postgres`.

## Setup

### 1. Clone and install dependencies

```bash
# Server
cd server
cp .env.example .env   # Edit with your DB and Stripe credentials
npm install

# Client
cd ../client
npm install
```

### 2. Configure environment

`DATABASE_URL` should already be set from the [Installing PostgreSQL](#installing-postgresql) step above. Open `server/.env` and fill in the remaining keys:

```
JWT_SECRET="change-this-to-a-random-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Run database migrations

```bash
cd server
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
cd server
node prisma/seed.js
```

This creates:
- 8 brands, 21 device models
- 5 product categories
- 50 products with 100+ variants
- 20 sample reviews
- 2 users (admin + customer)

### 5. Start development servers

```bash
# Terminal 1 — API server (port 3001)
cd server
npm run dev

# Terminal 2 — React client (port 5173)
cd client
npm run dev
```

Visit http://localhost:5173

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pedalarmor.com | admin123 |
| Customer | guitarist@example.com | customer123 |

## Project Structure

```
server/
  prisma/
    schema.prisma     # Database schema
    seed.js           # Seed data (50 products, brands, devices, reviews)
  src/
    index.js          # Express app entry point
    middleware/auth.js # JWT authentication
    routes/           # API route handlers
      auth.js         # Register, login, logout
      brands.js       # Brand listing and detail
      devices.js      # Device listing and detail
      products.js     # Product CRUD with filters
      cart.js         # Cart management
      orders.js       # Order creation and management
      users.js        # User profile and addresses
      reviews.js      # Product reviews
      payments.js     # Stripe payment intents

client/
  src/
    components/       # Navbar, Footer, ProductCard, StarRating
    context/          # AuthContext, CartContext
    pages/            # All page components
      admin/          # Admin dashboard pages
    api.js            # Axios instance with auth interceptor
    App.jsx           # Route definitions
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/brands | List all brands |
| GET | /api/brands/:slug | Brand detail with devices |
| GET | /api/devices | List devices (filter by brand) |
| GET | /api/devices/:slug | Device detail with products |
| GET | /api/products | List products (filters: brand, device, category, sort) |
| GET | /api/products/:slug | Product detail |
| POST/PUT/DELETE | /api/products | Admin CRUD |
| GET/POST | /api/cart | Cart operations |
| POST | /api/orders | Create order |
| GET | /api/orders | List orders |
| GET/POST | /api/products/:id/reviews | Product reviews |
| POST | /api/payments/create-intent | Stripe payment intent |
