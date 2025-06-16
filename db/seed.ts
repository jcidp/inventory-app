import { Client } from "pg";
import { pokemonSpecies, pokemonTypes } from "./enums";

function escapeSqlString(str: string) {
  return str.replace(/'/g, "''");
}

const formattedSpecies = pokemonSpecies.map(species => `'${escapeSqlString(species)}'`).join(", ");

const setupTables = `
DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS types;
DROP TYPE IF EXISTS pokemon_species;
DROP TYPE IF EXISTS pokemon_type;

CREATE TYPE pokemon_species AS ENUM (${formattedSpecies});
CREATE TYPE pokemon_type AS ENUM (${pokemonTypes.map(type => `'${type}'`).join(", ")});

CREATE TABLE IF NOT EXISTS types (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type pokemon_type
  );
  
CREATE TABLE IF NOT EXISTS trainers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255)
  );

CREATE TABLE IF NOT EXISTS pokemon (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  species pokemon_species,
  type_1_id INTEGER NOT NULL REFERENCES types(id),
  type_2_id INTEGER REFERENCES types(id),
  trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE
);
`;

const seedTypes = `INSERT INTO types (type) VALUES ${pokemonTypes.map(type => `('${type}')`).join(", ")};`;

const seedTrainers = `
INSERT INTO trainers (name) VALUES
  ('Ash'),
  ('Misty'),
  ('Brock');
`;

const seedPokemon = `
INSERT INTO pokemon (species, type_1_id, type_2_id, trainer_id) VALUES
  ('Pikachu', 4, NULL, 1),
  ('Charizard', 2, 10, 1),
  ('Squirtle', 3, NULL, 1),
  ('Bulbasaur', 5, NULL, 1),
  ('Pidgeot', 1, 10, 1),
  ('Lapras', 3, 6, 1),
  ('Psyduck', 3, NULL, 2),
  ('Starmie', 3, 11, 2),
  ('Horsea', 3, NULL, 2),
  ('Goldeen', 3, NULL, 2),
  ('Onix', 13, 9, 3),
  ('Geodude', 13, 9, 3),
  ('Vulpix', 2, NULL, 3),
  ('Golbat', 8, 10, 3);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.argv[2],
  });
  try {
    await client.connect();
    await client.query(setupTables);
    await client.query(seedTypes);
    await client.query(seedTrainers);
    await client.query(seedPokemon);
    console.log("done");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

main();
