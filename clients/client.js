const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const name = "misha";

const client = net.createConnection({ host: "127.0.0.1", port: 12345 }, () => {
  console.log("Есть подключение");
  rl.question("Whats your name: ", (answer) => {
    const name = answer;
    rl.on("line", (msg) => {
      if (msg === "/quit") rl.close();
      client.write(`${name}: ${msg}`);
    });
  });
});

client.on("data", (data) => {
  console.log(data.toString());
});

client.on("end", () => {
  console.log("Соединение с сервером разорвано.");
});
