import { body, validationResult } from "express-validator";
import { query } from "../db";
import { pokemonSpecies } from "../db/enums";
import { queryTrainer } from "./trainersController";

const pokemonValidator = [
  body("species").trim()
    .isIn(pokemonSpecies).withMessage("Species must exist."),
  body("type1")
    .isInt({min: 1, max: 18}).withMessage("Type 1 must exist."),
  body("type2").optional({values: "falsy"})
    .isInt({min: 1, max: 18}).withMessage("Type 2 must exist.")
    .custom((value, { req }) => {
      if (value && parseInt(value) === parseInt(req.body.type1)) {
        throw new Error("Type 2 must be different from Type 1.");
      }
      return true;
    }),
];

export async function getAllPokemon(_req, res) {
  const { rows } = await query(`
    SELECT species, t1.type type_1, t2.type type_2, tr.name trainer
    FROM pokemon p
    JOIN types t1 ON p.type_1_id = t1.id
    LEFT JOIN types t2 ON p.type_2_id = t2.id
    JOIN trainers tr ON p.trainer_id = tr.id
    ORDER BY p.id;
  `);
 res.render("pokemon", {pokemon: rows});
}

export const createPokemon = [
  pokemonValidator,
  async (req, res) => {
    const { trainerId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const {trainer, pokemon, types} = await queryTrainer(trainerId);
      return res.status(400).render("trainer", {
        trainer,
        pokemon,
        types,
        errors: errors.array()
      });
    }
    const { species, type1, type2 } = req.body;
    await query(`
      INSERT INTO pokemon (species, type_1_id, type_2_id, trainer_id)
      VALUES ($1, $2, $3, $4);
    `, [species, type1, type2 || null, trainerId]);
    res.redirect(`/trainers/${trainerId}`);
  },
];

export async function removePokemon(req, res) {
  const { id } = req.params;
  const { rows: pokemon } = await query("DELETE FROM pokemon WHERE id = $1 RETURNING trainer_id", [id]);
  res.redirect(`/trainers/${pokemon[0].trainer_id}`);
}
