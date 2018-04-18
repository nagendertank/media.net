const Hapi = require("hapi");


const server = Hapi.server({
  port: 3000,
  host: "localhost"
});

const io = require("socket.io")(server.listener);

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

io.on("connect", function(socket) {
  socket.broadcast.emit("Oh hii!");

  socket.on("message", function(data) {
      console.log(data);
    socket.emit("message", data);
  });
});

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
