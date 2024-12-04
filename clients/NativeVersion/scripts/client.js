const WebSocket = require("ws");
require("dotenv").config();

const HOST = process.env.EXPO_PUBLIC_API_URL;
const PORT = process.env.EXPO_PUBLIC_API_PORT;

const ws = new WebSocket(`${HOST}:${PORT}`);

ws.on("open", function open() {
  console.log("Соединение установлено");
  sendMessage();
});

ws.on("message", function incoming(data) {
  console.log(`Сообщение от сервера: ${data}`);
});

ws.on("close", function close() {
  console.log("Соединение закрыто");
});

ws.on("error", function error(err) {
  console.error("Ошибка:", err.message);
});

function sendMessage() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question("What's your name? ", (name) => {
    readline.on("line", (message) => {
      if (message === "/quit") {
        console.log("Выход...");
        ws.close();
        readline.close();
        return;
      }
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}`;
      const data = JSON.stringify({ message: message, name: name, time: time });
      ws.send(data);
      readline.prompt();
    });
  });
}
