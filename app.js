import express from "express";
import fileUpload from "express-fileupload";
import videoRoute from "./src/routes/upload-video.route.js";
import UserRoute from "./src/routes/user.route.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/upload", videoRoute);



app.use(express.static(path.join(__dirname, "/dist")));

app.get("*", (req, res) => {
  if (req.path == "robots.txt") {
    return res.sendFile(path.join(__dirname, "/dist/robots.txt"));
  }
  res.sendFile(path.join(__dirname, "/dist", "index.html"));
});


export { app };
