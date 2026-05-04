const Message = require('../models/messageModel');

const sendMessageService = async (io, data) => {

  const insertId = await Message.create(data);

  const newMessage = {
    id: insertId,
    ...data,
    status: "sent",
    created_at: new Date()
  };

  // realtime emit
  if (io) {
    io.to(data.room_id).emit("receive_message", newMessage);
  }

  return newMessage;
};

module.exports = { sendMessageService };
