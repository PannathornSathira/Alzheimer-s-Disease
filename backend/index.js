const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sessionRoutes = require('./routes/sessionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 10000;
const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://alzheimer-s-disease.vercel.app'
];

function getAllowedOrigins(value = process.env.FRONTEND_ORIGIN) {
    const configuredOrigins = (value || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins]);
}

const allowedOrigins = getAllowedOrigins();

function isAllowedOrigin(origin, origins = allowedOrigins) {
    return !origin || origins.has(origin);
}

// Middleware
app.use(cors({
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error('Origin is not allowed by CORS'));
    }
}));
app.use(express.json());

// Main Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

// Basic Health Check Route
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'alzheimer-trial-backend' });
});

// Render health check: verifies both the API process and PostgreSQL connection.
app.get('/api/keep-alive', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok', service: 'alzheimer-trial-backend', database: 'ok' });
    } catch (error) {
        console.error('Database health check failed');
        res.status(503).json({ status: 'unavailable', error: 'Database connection failed' });
    }
});

// Start Server
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Current Server is running on port: ${PORT}`);
    });
}

module.exports = { app, getAllowedOrigins, isAllowedOrigin };
