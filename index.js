import dotenv from 'dotenv'
dotenv.config();
import { app } from "./app.js";
import { Connection } from "./src/db/conn.js";
let port = process.env.PORT || 3003;
Connection()
  .then(() => {
    app.listen(port, () => {
      console.log("App is listening on port"+ port);
    });
  })
  .catch(() => {
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
  });
