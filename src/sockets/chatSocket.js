const { sendMessageService } = require('../services/messageService');
const Message = require('../models/messageModel');

// ─── Console Colors ────────────────────────────────────────────
const C = {
    reset:  '\x1b[0m',
    green:  '\x1b[32m',
    yellow: '\x1b[33m',
    cyan:   '\x1b[36m',
    red:    '\x1b[31m',
    blue:   '\x1b[34m',
    magenta:'\x1b[35m',
    gray:   '\x1b[90m',
    bold:   '\x1b[1m',
};

const timestamp = () => {
    const now = new Date();
    return C.gray + `[${now.toLocaleTimeString('en-IN', { hour12: true })}]` + C.reset;
};

const log = {
    connect:    (msg) => console.log(`${timestamp()} ${C.green}${C.bold}✔ CONNECT   ${C.reset}${C.green}${msg}${C.reset}`),
    join:       (msg) => console.log(`${timestamp()} ${C.cyan}${C.bold}🚪 JOIN ROOM ${C.reset}${C.cyan}${msg}${C.reset}`),
    send:       (msg) => console.log(`${timestamp()} ${C.blue}${C.bold}📤 SENT      ${C.reset}${C.blue}${msg}${C.reset}`),
    receive:    (msg) => console.log(`${timestamp()} ${C.magenta}${C.bold}📩 RECEIVED  ${C.reset}${C.magenta}${msg}${C.reset}`),
    typing:     (msg) => console.log(`${timestamp()} ${C.yellow}${C.bold}✏  TYPING    ${C.reset}${C.yellow}${msg}${C.reset}`),
    disconnect: (msg) => console.log(`${timestamp()} ${C.red}${C.bold}✖ DISCONNECT${C.reset}${C.red}${msg}${C.reset}`),
    error:      (msg) => console.error(`${timestamp()} ${C.red}${C.bold}⚠ ERROR     ${C.reset}${C.red}${msg}${C.reset}`),
    status:     (msg) => console.log(`${timestamp()} ${C.yellow}✔ STATUS     ${C.reset}${C.yellow}${msg}${C.reset}`),
};

// ─── Socket Handler ────────────────────────────────────────────
module.exports = (io) => {
    io.on('connection', (socket) => {
        log.connect(`Socket ID: ${socket.id}`);

        // ── User joins a room ──────────────────────────────────
        socket.on('join_room', (room_id) => {
            socket.join(room_id);
            log.join(`Socket ${socket.id} joined Room: ${room_id}`);
        });

        // 1️⃣ Send Message
        socket.on('send_message', async (data) => {
            log.send(`Room: ${data.room_id} | From: ${data.sender_id} | Msg: "${data.message}"`);
            try {
                await sendMessageService(io, data);
            } catch (err) {
                log.error(`send_message failed: ${err.message}`);
            }
        });

        // 2️⃣ Delivered Tick
        socket.on('message_delivered', async ({ message_id, room_id }) => {
            log.status(`Message ${message_id} delivered in Room: ${room_id}`);
            try {
                await Message.updateStatus(message_id, "delivered");
                io.to(room_id).emit("message_status_update", {
                    message_id,
                    status: "delivered"
                });
            } catch (err) {
                log.error(`message_delivered failed: ${err.message}`);
            }
        });

        // 3️⃣ Read Tick
        socket.on('messages_read', async ({ room_id, user_id }) => {
            log.status(`Messages in Room ${room_id} read by User: ${user_id}`);
            try {
                await Message.markRoomRead(room_id, user_id);
                io.to(room_id).emit("message_status_update", {
                    room_id,
                    status: "read"
                });
            } catch (err) {
                log.error(`messages_read failed: ${err.message}`);
            }
        });

        // ── Typing indicator ──────────────────────────────────
        socket.on('typing', (data) => {
            const { room_id, user_id, isTyping } = data;
            socket.to(room_id).emit('display_typing', { user_id, isTyping });
        });

        // ── Disconnect ────────────────────────────────────────
        socket.on('disconnect', () => {
            log.disconnect(`Socket ID: ${socket.id}`);
        });
    });
};
