const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const paddyTypeRoutes = require('./routes/paddyType');
const purchaseRoutes = require('./routes/purchase');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
    });
}

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Rice Mill API is running',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/paddy-types', paddyTypeRoutes);
app.use('/api/purchases', purchaseRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;
