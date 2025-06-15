import { query } from "../db";

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
