import express from "express";
import BaseController from "./controllers/abstractions/base-controller.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  public app: express.Application;
  public port: number | string;

  constructor(controllers: BaseController[], port: number | string) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeStaticFiles();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeStaticFiles() {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  private initializeControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  private initializeRoutes() {
    this.app.get("/", (request, response) => {
      response.sendFile(path.join(__dirname, "../public/index.html"));
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on http://localhost:${this.port}`);
      console.log(`📊 API endpoints available at http://localhost:${this.port}/api/users`);
    });
  }
}

export default App;
