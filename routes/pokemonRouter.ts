import { Router } from "express";
import { createPokemon, getAllPokemon } from "../controllers/pokemonController";

const pokemonRouter = Router();

pokemonRouter.get("/", getAllPokemon);
// pokemonRouter.get("/new", newPokemon);
pokemonRouter.post("/create/:trainerId", createPokemon);
// pokemonRouter.delete("/:id", removePokemon);

export default pokemonRouter;
