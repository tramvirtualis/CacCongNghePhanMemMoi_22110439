import express from "express";
import pool from "../db.js";
import BaseController from "./abstractions/base-controller.js";
import { Hero } from "../models/hero.js";

export default class HeroController extends BaseController {
  public path = "/heroes";

  constructor() {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get(this.path, this.getAllHeroes);
    this.router.get(`${this.path}/:id`, this.getHeroById);
    this.router.post(this.path, this.addHero);
    this.router.put(`${this.path}/:id`, this.updateHero);
    this.router.delete(`${this.path}/:id`, this.deleteHero);
  }

  private getAllHeroes = async (_req: express.Request, res: express.Response) => {
    try {
      const [rows] = await pool.query("SELECT * FROM heroes ORDER BY id DESC");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching heroes", error });
    }
  };

  private getHeroById = async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await pool.query("SELECT * FROM heroes WHERE id = ?", [id]);
      const data = Array.isArray(rows) ? (rows as any[])[0] : null;
      if (!data) return res.status(404).json({ message: "Hero not found" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hero", error });
    }
  };

  private addHero = async (req: express.Request, res: express.Response) => {
    try {
      const body: Partial<Hero> = req.body;
      if (!body?.name || !body?.power) {
        return res.status(400).json({ message: "name & power are required" });
      }
      const [result] = await pool.execute(
        "INSERT INTO heroes (name, power) VALUES (?, ?)",
        [body.name, body.power]
      );
      const insertId = (result as any).insertId as number;
      res.status(201).json({ id: insertId, ...body });
    } catch (error) {
      res.status(500).json({ message: "Error creating hero", error });
    }
  };

  private updateHero = async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const body: Partial<Hero> = req.body;
      const [result] = await pool.execute(
        "UPDATE heroes SET name = COALESCE(?, name), power = COALESCE(?, power) WHERE id = ?",
        [body.name ?? null, body.power ?? null, id]
      );
      if ((result as any).affectedRows === 0) return res.status(404).json({ message: "Hero not found" });
      res.json({ id, ...body });
    } catch (error) {
      res.status(500).json({ message: "Error updating hero", error });
    }
  };

  private deleteHero = async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const [result] = await pool.execute("DELETE FROM heroes WHERE id = ?", [id]);
      if ((result as any).affectedRows === 0) return res.status(404).json({ message: "Hero not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting hero", error });
    }
  };
}