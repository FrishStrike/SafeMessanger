const net = require("net");

function interactionWithTheServer(name, code) {
  const client = net.createConnection(
    { host: "127.0.0.1", port: 12345 },
    () => {
      console.log("Есть подключение");
      client.write(`${name}:${code}`);
    }
  );

  client.on("data", (data) => {
    console.log(data.toString());
  });

  client.on("end", () => {
    console.log("Соединение с сервером разорвано.");
  });
}

export default interactionWithTheServer;
