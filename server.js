"use strict";

const Hapi = require("hapi");
const Path = require("path");

const server = Hapi.server({
  port: process.env.PORT || 3000,
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
