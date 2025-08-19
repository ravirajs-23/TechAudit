# Tech Audit API - Usage Guide

## 🚀 Getting Started

### 1. Start the Backend Server
```bash
npm run dev
```

### 2. Access Swagger Documentation
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

## 📖 Interactive API Documentation

The Swagger UI provides:
- **Interactive Testing**: Test all endpoints directly from the browser
- **Request Examples**: Pre-filled request bodies for testing
- **Response Schemas**: Complete data structure documentation
- **Authentication**: Try protected endpoints with JWT tokens
- **Error Handling**: All possible error scenarios documented

## 🔐 Authentication Flow

### Step 1: Register a New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

### Step 2: Login to Get Token
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Step 3: Use Token for Protected Endpoints
```bash
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing with Swagger UI

### 1. **Register Endpoint**
- Go to `/api/auth/register` in Swagger UI
- Click "Try it out"
- Use the example request body
- Click "Execute"

### 2. **Login Endpoint**
- Go to `/api/auth/login` in Swagger UI
- Click "Try it out"
- Use the example request body
- Click "Execute"
- Copy the returned token

### 3. **Protected Endpoints**
- Click the "Authorize" button at the top
- Enter: `Bearer <your-token>`
- Now you can test protected endpoints like `/api/auth/me`

## 📋 Available Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `GET /health` - Health check

### Protected Endpoints (Require JWT)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get user profile
- `GET /api/auth/validate` - Validate token

## 🔧 Environment Setup

Make sure your `.env` file contains:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tech-audit
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on port 5000

3. **Swagger UI Not Loading**
   - Check if server is running
   - Verify `/api-docs` route is accessible

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📚 Additional Resources

- **Swagger Documentation**: https://swagger.io/docs/
- **OpenAPI Specification**: https://swagger.io/specification/
- **JWT Authentication**: https://jwt.io/
- **MongoDB**: https://docs.mongodb.com/

## 🎯 Next Steps

1. **Test all endpoints** using Swagger UI
2. **Implement additional features** (audit management, reporting)
3. **Add more validation** and error handling
4. **Implement rate limiting** and security enhancements
5. **Add comprehensive testing** with Jest

---

**Happy API Testing! 🚀**
