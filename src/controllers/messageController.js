const { sendMessageService } = require('../services/messageService');
const Message = require('../models/messageModel');

let ioInstance;

exports.setSocketInstance = (io) => { 
    ioInstance = io; 
};

// Swagger / API se message send
exports.sendMessageAPI = async (req, res) => {
    try {
        const msg = await sendMessageService(ioInstance, req.body);
        res.status(201).json(msg);
    } catch (err) {
        console.error('Error in sendMessageAPI:', err);
        res.status(500).json({ error: "Failed to send message" });
    }
};

// mark read API
exports.markReadAPI = async (req, res) => {
    try {
        const { room_id, user_id } = req.body;
        await Message.markRoomRead(room_id, user_id);
        
        if (ioInstance) {
            ioInstance.to(room_id).emit("message_status_update", { room_id, status: "read" });
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error in markReadAPI:', err);
        res.status(500).json({ error: "Failed to mark as read" });
    }
};

exports.getMessageHistory = async (req, res) => {
    const { room_id } = req.params;
    try {
        const messages = await Message.findByRoom(room_id);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getRecentChats = async (req, res) => {
    const { user_id } = req.params;
    try {
        const chats = await Message.getChatList(user_id);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chat list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
