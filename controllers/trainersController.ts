import { query } from "../db";
import CustomNotFoundError from "../errors/CustomNotFoundError";

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
  const { rows } = await query("SELECT name FROM trainers WHERE id = $1", [id]);
  if (!rows.length) throw new CustomNotFoundError("Trainer not found");
  const trainer = rows[0];
  const pokemon = getTrainerPokemon(id);
  res.render("trainer", {trainer, pokemon});
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
