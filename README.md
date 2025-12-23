# GlobalDevConnect 🌐

A production-ready **full-stack social networking platform** for developers, built with Node.js, Express.js, and MongoDB. Features real-time messaging, secure authentication, payment processing, and automated email notifications.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)

## 🎯 Overview

GlobalDevConnect enables developers to discover, connect, and collaborate with peers worldwide. The platform implements a Tinder-like connection system where users can express interest in others, accept/reject requests, and chat in real-time once connected.

**Live Demo:** [nabeelfarooq.live](https://nabeelfarooq.live)

## ✨ Key Features

### Authentication & Security
- **JWT-based authentication** with HTTP-only cookies for XSS protection
- **Password hashing** using bcrypt with salt rounds
- **Input validation** and sanitization using validator.js
- **CORS configuration** for secure cross-origin requests

### Connection System
- **Interest-based matching** — Send "interested" or "ignored" signals
- **Request management** — Accept or reject incoming connection requests
- **Smart feed algorithm** — Excludes existing connections, pending requests, and ignored users
- **Pagination support** — Efficient data loading with customizable limits

### Real-Time Communication
- **WebSocket integration** using Socket.io for instant messaging
- **Private chat rooms** — SHA-256 hashed room IDs for secure 1:1 conversations
- **Connection-based access** — Chat only available between accepted connections

### Payment Integration
- **Razorpay payment gateway** for premium memberships
- **Webhook validation** for secure payment confirmation
- **Membership tiers** — Silver and Gold subscription plans
- **Order tracking** with complete payment lifecycle management

### Email Services
- **AWS SES integration** for transactional emails
- **Connection notifications** — Email alerts for new friend requests
- **Automated reminders** — Cron jobs for pending request notifications

## 🏗️ Architecture

```
src/
├── app.js                 # Application entry point & server setup
├── config/
│   └── database.js        # MongoDB connection configuration
├── middlewares/
│   └── auth.js            # JWT verification middleware
├── models/
│   ├── user.js            # User schema with validation & methods
│   ├── connectionRequest.js # Connection request schema with indexes
│   └── payment.js         # Payment transaction schema
├── routes/
│   ├── auth.js            # Signup, login, logout endpoints
│   ├── profile.js         # Profile view, edit, password change
│   ├── request.js         # Connection request management
│   ├── user.js            # Feed, connections, received requests
│   └── payment.js         # Payment creation & webhook handling
└── utils/
    ├── validation.js      # Input validation helpers
    ├── socket.js          # Socket.io initialization & handlers
    ├── razorpay.js        # Razorpay instance configuration
    ├── sendEmail.js       # AWS SES email commands
    ├── sesClient.js       # AWS SES client setup
    ├── cronjob.js         # Scheduled tasks for notifications
    └── constants.js       # Application constants
```

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT, bcrypt, HTTP-only cookies |
| **Real-time** | Socket.io |
| **Payments** | Razorpay |
| **Email** | AWS SES |
| **Scheduling** | node-cron |
| **Validation** | validator.js |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Authenticate user |
| POST | `/logout` | Clear authentication |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/view` | Get current user profile |
| PATCH | `/profile/edit` | Update profile fields |
| PATCH | `/profile/password` | Change password |

### Connections
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/request/send/:status/:toUserId` | Send interest/ignore |
| POST | `/request/review/:status/:requestId` | Accept/reject request |
| GET | `/user/requests/received` | Get pending requests |
| GET | `/user/connections` | Get accepted connections |
| GET | `/feed` | Get discoverable users |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/create` | Create payment order |
| POST | `/payment/webhook` | Handle Razorpay webhook |
| GET | `/premium/verify` | Check premium status |

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB instance (local or Atlas)
- Razorpay account (for payments)
- AWS account with SES configured (for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/NabeelFarooq/globaldevconnect.git
cd globaldevconnect

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Environment Variables

```env
PORT=7777
DB_CONNECTION_STRING=mongodb://localhost:27017/globaldevconnect
JWT_SECRET=your_jwt_secret_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# AWS SES
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:7777`

## 🔐 Security Implementations

- **Password Security**: Bcrypt hashing with configurable salt rounds
- **Token Security**: JWT stored in HTTP-only cookies (prevents XSS)
- **Input Validation**: Server-side validation for all user inputs
- **Database Indexes**: Compound indexes for optimized queries
- **Webhook Verification**: Razorpay signature validation for payment security
- **CORS Protection**: Configured allowed origins for API access

## 📊 Database Schema

### User Model
- Indexed on `firstName` and `lastName` for search optimization
- Email uniqueness enforced at database level
- Strong password validation using validator.js
- Instance methods for JWT generation and password verification

### Connection Request Model
- Compound index on `fromUserId` and `toUserId`
- Pre-save hook prevents self-connection requests
- Status enum: `interested`, `ignored`, `accepted`, `rejected`

## 🔄 Real-Time Features

The Socket.io implementation enables:

1. **Secure Room Creation**: SHA-256 hashed room IDs from sorted user IDs
2. **Event Handling**: `joinChat`, `sendMessage`, `messageReceived`
3. **Connection Isolation**: Users can only chat with accepted connections

```javascript
// Room ID generation ensures same room regardless of who initiates
const roomId = crypto
  .createHash("sha256")
  .update([userId, targetUserId].sort().join("_"))
  .digest("hex");
```

## ⏰ Automated Tasks

Daily cron job runs at 10:58 AM to:
- Find pending connection requests from the previous day
- Send reminder emails to users with pending requests
- Uses date-fns for precise date calculations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Nabeel Farooq**
- GitHub: [@NabeelFarooq](https://github.com/NabeelFarooq)
- LinkedIn: [nabeelfarooq7](https://linkedin.com/in/nabeelfarooq7)

---

⭐ If you found this project helpful, please consider giving it a star!
