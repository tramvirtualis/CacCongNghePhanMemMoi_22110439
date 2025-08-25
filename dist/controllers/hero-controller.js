import pool from "../db.js";
import BaseController from "./abstractions/base-controller.js";
export default class HeroController extends BaseController {
    constructor() {
        super();
        this.path = "/heroes";
        this.getAllHeroes = async (_req, res) => {
            try {
                const [rows] = await pool.query("SELECT * FROM heroes ORDER BY id DESC");
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching heroes", error });
            }
        };
        this.getHeroById = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const [rows] = await pool.query("SELECT * FROM heroes WHERE id = ?", [id]);
                const data = Array.isArray(rows) ? rows[0] : null;
                if (!data)
                    return res.status(404).json({ message: "Hero not found" });
                res.json(data);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching hero", error });
            }
        };
        this.addHero = async (req, res) => {
            try {
                const body = req.body;
                if (!body?.name || !body?.power) {
                    return res.status(400).json({ message: "name & power are required" });
                }
                const [result] = await pool.execute("INSERT INTO heroes (name, power) VALUES (?, ?)", [body.name, body.power]);
                const insertId = result.insertId;
                res.status(201).json({ id: insertId, ...body });
            }
            catch (error) {
                res.status(500).json({ message: "Error creating hero", error });
            }
        };
        this.updateHero = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const body = req.body;
                const [result] = await pool.execute("UPDATE heroes SET name = COALESCE(?, name), power = COALESCE(?, power) WHERE id = ?", [body.name ?? null, body.power ?? null, id]);
                if (result.affectedRows === 0)
                    return res.status(404).json({ message: "Hero not found" });
                res.json({ id, ...body });
            }
            catch (error) {
                res.status(500).json({ message: "Error updating hero", error });
            }
        };
        this.deleteHero = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const [result] = await pool.execute("DELETE FROM heroes WHERE id = ?", [id]);
                if (result.affectedRows === 0)
                    return res.status(404).json({ message: "Hero not found" });
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: "Error deleting hero", error });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllHeroes);
        this.router.get(`${this.path}/:id`, this.getHeroById);
        this.router.post(this.path, this.addHero);
        this.router.put(`${this.path}/:id`, this.updateHero);
        this.router.delete(`${this.path}/:id`, this.deleteHero);
    }
}
