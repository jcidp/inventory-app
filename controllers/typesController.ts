import { query } from "../db";
import CustomNotFoundError from "../errors/CustomNotFoundError";

export async function getTypes(_req, res) {
  const { rows } = await query(`
    SELECT *
    FROM types
    ORDER BY id;
  `);
  res.render("types", {types: rows});
}

export async function getType(req, res) {
  const { id } = req.params;
  const { rows } = await query("SELECT type FROM types WHERE id = $1", [id]);
  if (!rows.length) throw new CustomNotFoundError("Type not found");
  const type = rows[0];
  const pokemon = getTypePokemon(id);
  res.render("type", {type, pokemon});
}

async function getTypePokemon(typeId: number) {
  const {rows} = await query(`
    SELECT species, t1.type type_1, t2.type type_2, tr.name trainer
    FROM pokemon p
    JOIN types t1 ON p.type_1_id = t1.id
    LEFT JOIN types t2 ON p.type_2_id = t2.id
    JOIN trainers tr ON p.trainer_id = tr.id
    WHERE t1.id = $1 OR t2.id = $1
    ORDER BY p.id;
  `, [typeId]);
  return rows;
}
