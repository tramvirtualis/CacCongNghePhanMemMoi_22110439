import express from "express";
export default class BaseController {
    constructor() {
        this.router = express.Router();
    }
}
