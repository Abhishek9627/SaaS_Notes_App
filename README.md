# Multi-Tenant SaaS Notes Application

A secure, multi-tenant notes application built with Next.js, featuring role-based access control, subscription management, and tenant isolation.

## 🚀 Features

- **Multi-Tenancy**: Support for multiple tenants (Acme, Globex) with strict data isolation
- **Authentication**: JWT-based authentication with role-based access control
- **Subscription Management**: Free plan (3 notes max) and Pro plan (unlimited notes)
- **Notes CRUD**: Full create, read, update, delete functionality for notes
- **Role-Based Access**: Admin and Member roles with different permissions
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **API-First**: RESTful API with CORS enabled for external integrations

## 🏗️ Architecture

### Multi-Tenancy Approach
This application uses a **shared schema with tenant_id** approach:
- Single database with tenant_id columns in all tables
- Strict tenant isolation enforced at the application level
- Efficient resource utilization while maintaining security
- Easy to scale and maintain

### Tech Stack
- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

## 🛠️ Local Development Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   ```

3. **Set up Database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with test data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Test Accounts

All test accounts use the password: `password`

### Acme Corporation
- **Admin**: `admin@acme.test` (can invite users, upgrade subscriptions)
- **Member**: `user@acme.test` (can manage notes only)

### Globex Corporation  
- **Admin**: `admin@globex.test` (can invite users, upgrade subscriptions)
- **Member**: `user@globex.test` (can manage notes only)

## 📚 API Documentation

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@acme.test",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "admin@acme.test",
    "role": "ADMIN",
    "tenantSlug": "acme"
  }
}
```

### Notes API

All notes endpoints require authentication via `Authorization: Bearer <token>` header.

#### GET /api/notes
Get all notes for the authenticated user's tenant.

**Response:**
```json
[
  {
    "id": "note-id",
    "title": "Note Title",
    "content": "Note content",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "email": "user@acme.test"
    }
  }
]
```

#### POST /api/notes
Create a new note.

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content"
}
```

**Response:** Created note object (same format as GET)

#### GET /api/notes/:id
Get a specific note by ID.

#### PUT /api/notes/:id
Update a note by ID.

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### DELETE /api/notes/:id
Delete a note by ID.

**Response:**
```json
{
  "message": "Note deleted successfully"
}
```

### Tenant Management

#### POST /api/tenants/:slug/upgrade
Upgrade tenant to Pro plan (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Tenant upgraded to Pro successfully",
  "tenant": {
    "id": "tenant-id",
    "name": "Acme Corporation",
    "slug": "acme",
    "plan": "PRO"
  }
}
```

### Health Check

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## 🚀 Deployment to Vercel

1. **Prepare for Deployment**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Set Environment Variables in Vercel**
   - `DATABASE_URL`: Your production database URL
   - `JWT_SECRET`: A secure JWT secret key

4. **Database Setup in Production**
   ```bash
   # After deployment, run database migrations
   vercel env pull .env.local
   npm run db:push
   npm run db:seed
   ```

## 🔒 Security Features

- **Tenant Isolation**: Data is strictly isolated by tenant_id
- **Role-Based Access Control**: Different permissions for Admin and Member roles
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using Zod schemas
- **CORS Configuration**: Properly configured for API access

## 📊 Subscription Plans

### Free Plan
- Maximum 3 notes per tenant
- Full CRUD operations
- Upgrade prompt when limit is reached

### Pro Plan  
- Unlimited notes
- All Free plan features
- Accessible only by tenant admins

## 🧪 Testing the Application

1. **Login as Different Users**
   - Test both Acme and Globex tenants
   - Verify tenant isolation (users can't see other tenant's data)

2. **Test Note Limits**
   - Create 3 notes as a Free tenant
   - Verify upgrade prompt appears
   - Test upgrade functionality as Admin

3. **Test Role Permissions**
   - Verify only Admins can upgrade tenants
   - Verify Members can manage notes but not upgrade

4. **Test API Endpoints**
   - Use tools like Postman or curl to test all API endpoints
   - Verify authentication is required
   - Test CORS functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, Prisma, and Vercel**
