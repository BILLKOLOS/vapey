# VapeY Investment Backend API

A comprehensive MERN (MongoDB, Express.js, React, Node.js) backend for the VapeY Investment platform.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Role-based access control (User, Admin, Moderator)
  - Account security features (2FA, login history, failed attempt tracking)

- **Investment Management**
  - Multiple investment plans with different ROIs
  - Investment tracking and profit calculation
  - Withdrawal and deposit management
  - Transaction history

- **Referral System**
  - Multi-level referral tracking
  - Referral bonuses and earnings
  - Referral leaderboard
  - Share links and social media integration

- **Notification System**
  - Real-time notifications
  - Email notifications (configurable)
  - Push notifications
  - Broadcast notifications for admins

- **Security Features**
  - Rate limiting
  - Input validation and sanitization
  - CORS protection
  - Helmet security headers
  - Account locking after failed attempts

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/vapey-investment

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Security
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/referrals` - Get user referrals
- `GET /api/users/login-history` - Get login history
- `POST /api/users/upload-avatar` - Upload avatar
- `DELETE /api/users/account` - Delete account

### Investment Endpoints

- `GET /api/investments/plans` - Get investment plans
- `GET /api/investments/plans/:id` - Get specific plan
- `POST /api/investments` - Create investment
- `GET /api/investments` - Get user investments
- `GET /api/investments/:id` - Get specific investment
- `POST /api/investments/:id/withdraw-profit` - Withdraw profit
- `GET /api/investments/stats/daily-profits` - Get daily profits

### Transaction Endpoints

- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions/deposit` - Create deposit
- `POST /api/transactions/withdrawal` - Create withdrawal
- `GET /api/transactions/stats/balance-history` - Get balance history

### Referral Endpoints

- `GET /api/referrals/stats` - Get referral statistics
- `GET /api/referrals/earnings` - Get referral earnings
- `GET /api/referrals/network` - Get referral network
- `POST /api/referrals/claim-bonus` - Claim referral bonus
- `GET /api/referrals/share-link` - Get share link
- `GET /api/referrals/leaderboard` - Get leaderboard

### Notification Endpoints

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/clear-old` - Clear old notifications

## 🗄️ Database Models

### User Model
- Personal information (name, email, phone, etc.)
- Security settings (2FA, password history, login attempts)
- Wallet balance and preferences
- Referral system integration
- Login history tracking

### Investment Model
- Investment details (amount, duration, ROI)
- Profit tracking and history
- Withdrawal management
- Status management (pending, active, completed, etc.)

### InvestmentPlan Model
- Plan configuration (min/max amounts, duration, ROI)
- Features and benefits
- Active/inactive status management

### Transaction Model
- Financial transaction tracking
- Multiple payment methods
- Fee calculation
- Status management

### Notification Model
- User notification management
- Different notification types
- Read/unread status
- Expiration handling

## 🔒 Security Features

- **Authentication**: JWT tokens with configurable expiration
- **Password Security**: bcrypt hashing with configurable rounds
- **Rate Limiting**: Configurable rate limiting per IP
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable CORS settings
- **Security Headers**: Helmet.js for security headers
- **Account Protection**: Automatic account locking after failed attempts

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vapey-investment
JWT_SECRET=your-production-jwt-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start server.js --name "vapey-investment-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Docker Deployment

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## 🔧 Development

### Project Structure

```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # Documentation
```

### Adding New Features

1. Create model in `models/` directory
2. Create routes in `routes/` directory
3. Add middleware if needed in `middleware/` directory
4. Update `server.js` to include new routes
5. Add validation and error handling
6. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- Authentication and user management
- Investment system
- Referral system
- Notification system
- Transaction management 