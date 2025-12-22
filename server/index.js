const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const checkExpiry = require('./cron/expiryCron');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Run Cron Job
checkExpiry();
// Restart Trigger: Fix Verify 500 Error

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Food For All API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/money', require('./routes/moneyRoutes'));
app.use('/api/distribution', require('./routes/distributionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/verification', require('./routes/verificationRoutes'));
app.use('/api/food-discovery', require('./routes/foodDiscoveryRoutes'));
app.use('/api/ngo', require('./routes/foodAvailabilityRoutes'));

// System Health Check
app.get('/api/system/health', require('./controllers/healthController').checkHealth);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
