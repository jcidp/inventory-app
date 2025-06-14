import { Client } from "pg";
import { pokemonSpecies, pokemonTypes } from "./enums";

function escapeSqlString(str: string) {
  return str.replace(/'/g, "''");
}

const cleanSpecies = pokemonSpecies.map(species => `'${escapeSqlString(species)}'`).join(", ");

const setupTables = `
DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS types;
DROP TYPE IF EXISTS pokemon_species;
DROP TYPE IF EXISTS pokemon_type;

CREATE TYPE pokemon_species AS ENUM (${cleanSpecies});
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
  trainer_id INTEGER NOT NULL REFERENCES trainers(id)
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.argv[2],
    statement_timeout: 0,
    query_timeout: 0,
  });
  try {
    await client.connect();
    await client.query(setupTables);
    console.log("done");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

main();
