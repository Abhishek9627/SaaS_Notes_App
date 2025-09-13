@echo off
echo 🚀 Setting up Multi-Tenant SaaS Notes Application...

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run db:generate

REM Push database schema
echo 🗄️ Setting up database...
call npm run db:push

REM Seed database with test data
echo 🌱 Seeding database with test data...
call npm run db:seed

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    echo DATABASE_URL="file:./dev.db" > .env.local
    echo JWT_SECRET="your-super-secret-jwt-key-change-in-production" >> .env.local
)

echo ✅ Setup complete!
echo.
echo 🎉 You can now start the development server with:
echo    npm run dev
echo.
echo 🔐 Test accounts:
echo    Acme: admin@acme.test / user@acme.test
echo    Globex: admin@globex.test / user@globex.test
echo    Password for all: password
echo.
echo 🌐 Open http://localhost:3000 to view the application
pause
