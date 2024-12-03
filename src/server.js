const WebSocket = require("ws");

const wss = new WebSocket.Server({ host: "0.0.0.0", port: 12345 });

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Клиент подключился.");
  clients.add(ws);

  // Обрабатываем входящие сообщения
  ws.on("message", (message) => {
    console.log(`Получено сообщение: ${message}`, message);

    // Рассылаем сообщение всем подключенным клиентам
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    }
  });

  ws.on("close", () => {
    console.log("Клиент отключился.");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("Ошибка:", error.message);
  });
});

console.log("WebSocket сервер запущен на порту 12345");
