import { body, validationResult } from "express-validator";
import { query } from "../db";
import CustomNotFoundError from "../errors/CustomNotFoundError";

const validateTrainer = [
  body("name").trim()
    .isAlpha().withMessage("Name must only contain letters.")
    .isLength({min: 1, max: 24}).withMessage("Name must be between 1 and 24 characters."),
];

export async function getTrainers(_req, res) {
  const { rows } = await query(`
    SELECT *
    FROM trainers
    ORDER BY id;
  `);
  res.render("index", {trainers: rows});
}

export async function getTrainer(req, res) {
  const { id } = req.params;
  const {trainer, pokemon, types} = await queryTrainer(id);
  res.render("trainer", {trainer, pokemon, types});
}

export async function queryTrainer(id: number) {
  const { rows } = await query("SELECT * FROM trainers WHERE id = $1;", [id]);
  if (!rows.length) throw new CustomNotFoundError("Trainer not found");
  const trainer = rows[0];
  const pokemon = await getTrainerPokemon(id);
  const { rows: types} = await query("SELECT * FROM types;")
  return {trainer, pokemon, types};
}

async function getTrainerPokemon(trainerId: number) {
  const {rows} = await query(`
    SELECT species, t1.type type_1, t2.type type_2, tr.name trainer
    FROM pokemon p
    JOIN types t1 ON p.type_1_id = t1.id
    LEFT JOIN types t2 ON p.type_2_id = t2.id
    JOIN trainers tr ON p.trainer_id = tr.id
    WHERE tr.id = $1
    ORDER BY p.id;
  `, [trainerId]);
  return rows;
}

export function newTrainer(_req, res) {
  res.render("newTrainer");
}

export const createTrainer = [
  validateTrainer,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newTrainer", {
        errors: errors.array(),
      });
    }
    const { name } = req.body;
    const { rows } = await query(`
      INSERT INTO trainers (name)
      VALUES ($1)
      RETURNING id;
    `, [name]);
    res.redirect(`/trainers/${rows[0].id}`);
  },
];