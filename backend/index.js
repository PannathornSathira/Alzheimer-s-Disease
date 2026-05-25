const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sessionRoutes = require('./routes/sessionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

// Basic Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'Clinical Trial Backend API is running!' });
});

// Keep-Alive Route for Render & Supabase
app.get('/api/keep-alive', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ message: 'Backend and Database are alive!' });
    } catch (error) {
        console.error('Keep-alive ping failed:', error);
        res.status(500).json({ error: 'Keep-alive ping failed' });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Current Server is running on port: ${PORT}`);
});