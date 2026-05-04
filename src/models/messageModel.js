const db = require('../config/db');

const Message = {

  create: async (data) => {
    const { room_id, sender_id, receiver_id, message, message_type, file_url } = data;

    const [result] = await db.execute(
      `INSERT INTO messages 
       (room_id, sender_id, receiver_id, message, message_type, file_url, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'sent')`,
      [room_id, sender_id, receiver_id, message, message_type || 'text', file_url || null]
    );

    return result.insertId;
  },

  findByRoom: async (room_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM messages 
       WHERE room_id=? 
       ORDER BY created_at ASC`,
      [room_id]
    );
    return rows;
  },

  updateStatus: async (message_id, status) => {
    await db.execute(
      "UPDATE messages SET status=? WHERE id=?",
      [status, message_id]
    );
  },

  markRoomRead: async (room_id, user_id) => {
    await db.execute(
      `UPDATE messages 
       SET status='read', is_read=1 
       WHERE room_id=? AND receiver_id=? AND status!='read'`,
      [room_id, user_id]
    );
  },

  // Keeping this for recent chats
  getChatList: async (user_id) => {
    const [rows] = await db.execute(
        `SELECT 
            m1.*
        FROM messages m1
        INNER JOIN (
            SELECT 
                room_id, 
                MAX(created_at) as max_created_at
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY room_id
        ) m2 ON m1.room_id = m2.room_id AND m1.created_at = m2.max_created_at
        WHERE m1.sender_id = ? OR m1.receiver_id = ?
        ORDER BY m1.created_at DESC`,
        [user_id, user_id, user_id, user_id]
    );
    return rows;
  }
};

module.exports = Message;
