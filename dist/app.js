import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class App {
    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeStaticFiles();
        this.initializeRoutes();
    }
    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
    initializeStaticFiles() {
        this.app.use(express.static(path.join(__dirname, "../public")));
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/api", controller.router);
        });
    }
    initializeRoutes() {
        this.app.get("/", (request, response) => {
            response.sendFile(path.join(__dirname, "../public/index.html"));
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server is running on http://localhost:${this.port}`);
            console.log(`📊 API endpoints available at http://localhost:${this.port}/api/users`);
        });
    }
}
export default App;
