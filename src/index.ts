import dotenv from "dotenv";
import App from "./app.js";
import UserController from "./controllers/user-controller.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = new App([new UserController()], port);

app.listen();
