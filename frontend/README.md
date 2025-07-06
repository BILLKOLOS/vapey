# VapeY Investment Frontend

A modern React-based frontend for the VapeY Investment trading platform, featuring a 2% daily ROI investment system with multi-level referrals.

## 🚀 Features

- **Investment Management**: Create and track investments with 2% daily ROI
- **Multi-level Referral System**: Earn commissions on 3 levels (7%, 3%, 1%)
- **Real-time Dashboard**: Live statistics and portfolio tracking
- **Withdrawal System**: Separate ROI and referral withdrawal pools
- **Achievement System**: Gamified user engagement with badges
- **Leaderboard**: Competitive ranking system
- **Security Features**: 2FA, SSL encryption, activity monitoring
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Recharts** - Chart components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Footer, etc.)
│   ├── Investment/     # Investment-related components
│   ├── Dashboard/      # Dashboard-specific components
│   ├── Referral/       # Referral system components
│   ├── Withdrawal/     # Withdrawal components
│   ├── Social/         # Social features (Leaderboard, Achievements)
│   ├── Modals/         # Modal components
│   └── UI/             # Basic UI components (Button, Input, etc.)
├── contexts/           # React Context providers
├── pages/              # Page components
├── services/           # API services and utilities
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── styles/             # Global styles and CSS
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🎨 Design System

### Colors
- **Primary**: `#667eea` (Blue gradient)
- **Secondary**: `#764ba2` (Purple gradient)
- **Success**: `#22c55e` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Danger**: `#ef4444` (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
All components follow a consistent design pattern with:
- Rounded corners (`rounded-xl`, `rounded-2xl`)
- Backdrop blur effects
- Gradient backgrounds
- Smooth transitions and hover effects
- Responsive design

## 🔐 Authentication

The app uses JWT-based authentication with:
- Automatic token refresh
- Protected routes
- Persistent login state
- Secure token storage

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENVIRONMENT=production
```

## 🔧 Configuration

### API Configuration
The API base URL can be configured in `src/services/api.js`:
```javascript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
```

### Tailwind Configuration
Custom colors, animations, and utilities are defined in `tailwind.config.js`.

## 📊 Features Overview

### Investment System
- Minimum investment: $20
- Maximum investment: $10,000
- Daily ROI: 2%
- Contract period: 200 days
- Payment method: Binance USDT TRC20

### Referral System
- Level 1: 7% commission
- Level 2: 3% commission
- Level 3: 1% commission
- Unlimited referrals

### Withdrawal System
- Minimum withdrawal: $10
- Twice daily withdrawals
- Separate ROI and referral pools
- USDT TRC20 payments

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
- Email: support@vapeyinvestment.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**VapeY Investment** - Modern Trading Platform with 2% Daily ROI 