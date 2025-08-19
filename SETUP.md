# Tech Audit Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or cloud)
3. **npm** or **yarn**

## Step 1: Install Dependencies

### Backend Dependencies
```bash
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

## Step 2: MongoDB Setup

### Option A: Local MongoDB Installation

1. **Download MongoDB Community Server** from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Install MongoDB** following the installation wizard
3. **Start MongoDB Service**:
   - Windows: MongoDB should start automatically as a service
   - macOS/Linux: `sudo systemctl start mongod`

### Option B: MongoDB Atlas (Cloud)

1. **Sign up** at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create a free cluster**
3. **Get connection string** and update your environment variables

### Option C: Docker (if available)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tech-audit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

## Step 4: Create Test User

Run the test user creation script:

```bash
node create-test-user.js
```

This will create a test user with:
- **Email**: admin@example.com
- **Password**: password123
- **Role**: admin

## Step 5: Start the Application

### Start Backend Server
```bash
npm run dev
```

### Start Frontend (in a new terminal)
```bash
cd frontend
npm start
```

## Step 6: Test Authentication

1. **Open** http://localhost:3000
2. **Login** with:
   - Email: admin@example.com
   - Password: password123

## Troubleshooting

### "Invalid email or password" Error

**Common Causes:**
1. **MongoDB not running** - Check if MongoDB service is started
2. **No users in database** - Run the test user creation script
3. **Wrong database connection** - Verify MONGODB_URI in .env file
4. **Backend server not running** - Check if backend is running on port 5000

**Debug Steps:**
1. Check MongoDB connection: `mongo` or `mongosh`
2. Check backend logs for connection errors
3. Verify database contains users: `db.users.find()`
4. Check network requests in browser DevTools

### MongoDB Connection Issues

**Windows:**
```bash
# Check if MongoDB service is running
services.msc
# Look for "MongoDB" service and ensure it's running
```

**macOS/Linux:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB if stopped
sudo systemctl start mongod
```

### Port Conflicts

If port 5000 is already in use:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## API Endpoints

- **Health Check**: GET http://localhost:5000/health
- **Login**: POST http://localhost:5000/api/auth/login
- **Register**: POST http://localhost:5000/api/auth/register
- **User Profile**: GET http://localhost:5000/api/auth/me

## Database Schema

**Users Collection:**
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['admin', 'auditor']),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes

1. **Change JWT_SECRET** in production
2. **Use strong passwords** in production
3. **Enable MongoDB authentication** in production
4. **Use HTTPS** in production
5. **Implement rate limiting** for production use

## Support

If you continue to experience issues:
1. Check the backend console logs
2. Verify MongoDB is running and accessible
3. Ensure all environment variables are set correctly
4. Check if the database contains the expected collections
