import express from "express";

export default abstract class BaseController {
    public router = express.Router();
    public abstract path: string;

    protected abstract initializeRoutes(): void;
}