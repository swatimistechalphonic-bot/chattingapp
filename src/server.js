const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const messageController = require('./controllers/messageController');
require('dotenv').config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initialize Socket logic
require('./sockets/chatSocket')(io);

// Pass socket instance to controllers
messageController.setSocketInstance(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on:`);
    console.log(`- Local:   http://localhost:${PORT}`);
    console.log(`- Network: http://192.168.1.7:${PORT}`);
});
