const WebSocket = require("ws");

const ws = new WebSocket("ws://192.168.0.104:12345");

ws.on("open", function open() {
  console.log("Соединение установлено");
  ws.send("Тестовое сообщение");
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

  readline.on("line", (message) => {
    if (message === "/quit") {
      console.log("Выход...");
      ws.close();
      readline.close();
      return;
    }

    ws.send(message);
    readline.prompt();
  });
}
