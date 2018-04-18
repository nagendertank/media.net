"use strict";

const Hapi = require("hapi");
const Path = require("path");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
  routes: {
    files: {
      relativeTo: Path.join(__dirname, "build")
    }
  }
});

const start = async () => {
  await server.register(require("inert"));

 server.route({
   method: "GET",
   path: "/{param*}",
   handler: {
     directory: {
       path: Path.join(__dirname, "build")
     }
   }
 });

  await server.start();

  console.log("Server running at:", server.info.uri);
};

start();
