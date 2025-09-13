#!/bin/bash

echo "🚀 Setting up Multi-Tenant SaaS Notes Application..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️ Setting up database..."
npm run db:push

# Seed database with test data
echo "🌱 Seeding database with test data..."
npm run db:seed

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
EOF
fi

echo "✅ Setup complete!"
echo ""
echo "🎉 You can now start the development server with:"
echo "   npm run dev"
echo ""
echo "🔐 Test accounts:"
echo "   Acme: admin@acme.test / user@acme.test"
echo "   Globex: admin@globex.test / user@globex.test"
echo "   Password for all: password"
echo ""
echo "🌐 Open http://localhost:3000 to view the application"
