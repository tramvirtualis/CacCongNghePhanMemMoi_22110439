import express from "express";
import pool from "../db.js";
import BaseController from "./abstractions/base-controller.js";
import { User } from "../models/user.js";

export default class UserController extends BaseController {
  public path = "/users";

  constructor() {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.post(this.path, this.addUser);
    this.router.put(`${this.path}/:id`, this.updateUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  private getAllUsers = async (_req: express.Request, res: express.Response) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users ORDER BY id DESC");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  };

  private getUserById = async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
      const data = Array.isArray(rows) ? (rows as any[])[0] : null;
      if (!data) return res.status(404).json({ message: "User not found" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  };

  private addUser = async (req: express.Request, res: express.Response) => {
    try {
      const body: Partial<User> = req.body;
      if (!body?.name || !body?.email || !body?.age) {
        return res.status(400).json({ message: "name, email & age are required" });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Validate age
      if (body.age < 0 || body.age > 150) {
        return res.status(400).json({ message: "Age must be between 0 and 150" });
      }

      const [result] = await pool.execute(
        "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
        [body.name, body.email, body.age]
      );
      const insertId = (result as any).insertId as number;
      res.status(201).json({ id: insertId, ...body });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  };

  private updateUser = async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const body: Partial<User> = req.body;
      
      // Validate email format if provided
      if (body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
      }
      
      // Validate age if provided
      if (body.age !== undefined && (body.age < 0 || body.age > 150)) {
        return res.status(400).json({ message: "Age must be between 0 and 150" });
      }

      const [result] = await pool.execute(
        "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), age = COALESCE(?, age) WHERE id = ?",
        [body.name ?? null, body.email ?? null, body.age ?? null, id]
      );
      if ((result as any).affectedRows === 0) return res.status(404).json({ message: "User not found" });
      res.json({ id, ...body });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  };

  private deleteUser = async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
      if ((result as any).affectedRows === 0) return res.status(404).json({ message: "User not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  };
}
