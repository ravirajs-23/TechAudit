# Tech Audit Management System

एक comprehensive technology audit management system जो Clean Architecture pattern का पालन करता है, Node.js backend, React.js frontend, और MongoDB database के साथ।

## 🏗️ Architecture Overview

यह project Clean Architecture principles का पालन करता है:

```
src/
├── domain/           # Business logic & entities
├── application/      # Use cases & application services
├── infrastructure/   # External concerns (DB, APIs)
└── presentation/     # Controllers, routes, middleware
```

## 🚀 Features

### Authentication & Authorization
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Auditor)
- ✅ Password hashing with bcrypt
- ✅ Token refresh mechanism

### User Management
- ✅ User roles (Admin, Auditor)
- ✅ User profile management
- ✅ Account activation/deactivation

### Security Features
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting ready

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React.js 18
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
TechAudit/
├── src/                          # Backend source code
│   ├── domain/                   # Domain layer
│   │   ├── entities/            # Business entities
│   │   ├── repositories/        # Repository interfaces
│   │   └── services/            # Service interfaces
│   ├── application/              # Application layer
│   │   └── useCases/            # Business use cases
│   ├── infrastructure/           # Infrastructure layer
│   │   ├── database/            # Database connection & models
│   │   ├── repositories/        # Repository implementations
│   │   └── services/            # Service implementations
│   └── presentation/             # Presentation layer
│       ├── routes/               # API routes
│       └── middleware/           # Middleware functions
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React context
│   │   └── services/            # API services
│   └── public/                  # Static assets
├── package.json                  # Backend dependencies
├── frontend/package.json        # Frontend dependencies
└── env.example                  # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

4. **Run backend**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

5. **Access API Documentation**
   ```
   http://localhost:5000/api-docs
   ```

## 🔧 Environment Variables

Backend (`.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tech-audit
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
```

Frontend (`.env`):
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/validate` - Validate JWT token

### Health Check
- `GET /health` - API health status

## 📖 API Documentation

### Interactive Swagger UI
Access the complete API documentation at:
```
http://localhost:5000/api-docs
```

### Features
- **Interactive Testing**: Test API endpoints directly from the browser
- **Request/Response Examples**: See sample data for all endpoints
- **Authentication**: Try endpoints with JWT tokens
- **Schema Definitions**: Complete data model documentation
- **Error Responses**: All possible error scenarios documented

### Documentation Includes
- ✅ All authentication endpoints
- ✅ Request/response schemas
- ✅ Validation rules
- ✅ Error handling
- ✅ Authentication requirements
- ✅ Example requests and responses

📖 **For detailed API usage, see**: [API_USAGE.md](./API_USAGE.md)

## 🔐 Authentication Flow

1. **Registration**: User creates account with email, password, name, and role
2. **Login**: User authenticates with email/password, receives JWT token
3. **Authorization**: Token included in Authorization header for protected routes
4. **Token Refresh**: Automatic token refresh using refresh token
5. **Logout**: Token invalidation and cleanup

## 🎨 UI Components

### Material-UI Components
- Responsive navigation drawer
- Form components with validation
- Data tables and cards
- Status indicators and chips
- Loading states and error handling

### Responsive Design
- Mobile-first approach
- Responsive grid system
- Adaptive navigation
- Touch-friendly interactions

## 🧪 Testing

### Backend Testing
```bash
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Build & Deployment

### Backend Production Build
```bash
npm run build
npm start
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Security**: Secure token generation and validation
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Helmet.js security middleware
- **Rate Limiting**: Ready for rate limiting implementation

## 🚧 Future Enhancements

### Planned Features
- [ ] Audit management system
- [ ] Excel file upload and parsing
- [ ] Report generation
- [ ] Email notifications
- [ ] Audit workflow management
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support
- [ ] API rate limiting
- [ ] Audit trail logging

### Technical Improvements
- [ ] Unit and integration tests
- [ ] API documentation (Swagger)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Error tracking and logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Clean Architecture principles by Robert C. Martin
- Material-UI for beautiful React components
- Express.js community for the robust framework
- MongoDB team for the flexible database solution

---

**Note**: यह project development phase में है। Production deployment से पहले security review और testing करें।

