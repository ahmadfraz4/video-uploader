import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { Connection } from "./src/db/conn.js";
import http from "http";
import { Server } from "socket.io";
let port = process.env.PORT || 3003

let server = http.createServer(app);
let io = new Server(server,{
  cors : {
    origin : 'http://localhost:5173'
  }
});

app.set('sockets', io);



Connection()
  .then(() => {
    server.listen(port, () => {
      console.log("App is listening on port" + port);
    });
  })
  .catch(() => {
    server.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
  });

