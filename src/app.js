const express = require('express');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Chat Server is running...');
});

module.exports = app;
