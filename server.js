const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

wss.on("connection", (ws) => {
    console.log("🔗 New client connected!");

    ws.on("message", (message) => {
        let data = JSON.parse(message);
        
        switch (data.type) {
            case "register":
                clients[data.userId] = ws;
                console.log(`✅ User registered: ${data.userId}`);
                break;
            
            case "offer":
            case "answer":
            case "candidate":
                if (clients[data.target]) {
                    clients[data.target].send(JSON.stringify(data));
                    console.log(`📩 ${data.type} sent from ${data.userId} to ${data.target}`);
                }
                break;
            
            default:
                console.log("❌ Unknown message type:", data);
        }
    });

    ws.on("close", () => {
        Object.keys(clients).forEach((key) => {
            if (clients[key] === ws) {
                console.log(`🚫 User disconnected: ${key}`);
                delete clients[key];
            }
        });
    });
});

console.log("🚀 Signaling Server running on ws://localhost:8080");
