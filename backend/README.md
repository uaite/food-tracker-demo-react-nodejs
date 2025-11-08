# Food Tracker Backend API

A robust REST API for food tracking with calorie management and admin features.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Setup database and seed data
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev
```

The API will be running at `http://localhost:3001`

## 🔧 Environment Variables

Copy `.env` file and update as needed:

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://fooduser:foodpass123@localhost:5432/food_tracker?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173

# Demo tokens (easily changeable)
USER_TOKEN=user-token-123
ADMIN_TOKEN=admin-token-456
```

## 🔐 Authentication

The API uses predefined tokens for demo purposes:

- **User Token**: `user-token-123` (John Doe - USER role)
- **Admin Token**: `admin-token-456` (Admin User - ADMIN role)

Include token in Authorization header:

```
Authorization: Bearer user-token-123
```

## 📋 API Endpoints

### Authentication

- `POST /auth/verify` - Verify token and return user info
- `GET /auth/me` - Get current user details

### Food Entries (User)

- `GET /api/food-entries` - List user's entries (with date filters)
- `POST /api/food-entries` - Create new entry
- `PUT /api/food-entries/:id` - Update entry
- `DELETE /api/food-entries/:id` - Delete entry
- `GET /api/food-entries/daily-totals` - Get daily calorie totals

### Meals

- `GET /api/meals` - Get available meals

### Admin (Admin only)

- `GET /api/admin/food-entries` - All entries from all users
- `POST /api/admin/food-entries` - Create entry for any user
- `PUT /api/admin/food-entries/:id` - Update any entry
- `DELETE /api/admin/food-entries/:id` - Delete any entry
- `GET /api/admin/reports/weekly-comparison` - 7-day comparison report
- `GET /api/admin/reports/average-calories` - Average calories per user

## 📊 Sample Usage

### Create Food Entry

```bash
curl -X POST http://localhost:3001/api/food-entries \
  -H "Authorization: Bearer user-token-123" \
  -H "Content-Type: application/json" \
  -d '{
    "foodName": "Grilled Chicken",
    "calories": 450,
    "mealId": "breakfast-meal-id",
    "entryDateTime": "2024-10-10T12:30:00Z"
  }'
```

### Get Daily Totals

```bash
curl "http://localhost:3001/api/food-entries/daily-totals?from=2024-10-01&to=2024-10-31" \
  -H "Authorization: Bearer user-token-123"
```

### Admin Report

```bash
curl http://localhost:3001/api/admin/reports/weekly-comparison \
  -H "Authorization: Bearer admin-token-456"
```

## 🎯 Key Features

- ✅ Token-based authentication (no signup needed)
- ✅ Role-based access control (USER/ADMIN)
- ✅ CRUD operations for food entries
- ✅ Meal categorization with entry limits
- ✅ Daily calorie limit warnings
- ✅ Date range filtering
- ✅ Admin reporting (7-day comparison, user averages)
- ✅ Input validation with Zod
- ✅ PostgreSQL database with Prisma ORM
- ✅ Comprehensive error handling
- ✅ CORS enabled for frontend

## 📁 Project Structure

```
backend/
├── src/
│   ├── middleware/     # Auth & error handling
│   ├── routes/         # API route handlers
│   ├── prisma/         # Database seeding
│   └── index.ts        # Express app setup
├── prisma/
│   └── schema.prisma   # Database schema
└── package.json
```

## 🛠️ Development Commands

```bash
# Development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database operations
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
pnpm db:seed        # Seed sample data
pnpm db:studio      # Open Prisma Studio
```

## 🧪 Testing the API

1. **Health Check**: `GET /health`
2. **User Authentication**: `POST /auth/verify` with Bearer token
3. **List Entries**: `GET /api/food-entries`
4. **Create Entry**: `POST /api/food-entries`
5. **Admin Reports**: `GET /api/admin/reports/weekly-comparison`

## 🎪 Demo Data

The seed script creates:

- 2 users (John Doe - USER, Admin User - ADMIN)
- 4 meal types (Breakfast, Lunch, Dinner, Snack)
- 10 days of sample food entries

Perfect for demonstrating all features during client presentations!

## � Database Setup

The backend uses **PostgreSQL 15** via Docker. Start the database with:

```bash
# Start PostgreSQL container
pnpm db:up

# Wait for the container to be healthy, then:
pnpm db:push    # Push schema to database
pnpm db:seed    # Seed with sample data
```

## �🔄 Database Schema

**Users**

- id, email, name, role, dailyCalorieLimit, token

**Meals**

- id, name, maxEntries

**FoodEntries**

- id, userId, mealId, foodName, calories, entryDateTime

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
