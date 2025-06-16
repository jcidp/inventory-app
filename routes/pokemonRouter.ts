import { Router } from "express";
import { createPokemon, getAllPokemon, removePokemon } from "../controllers/pokemonController";

const pokemonRouter = Router();

pokemonRouter.get("/", getAllPokemon);
pokemonRouter.post("/create/:trainerId", ...createPokemon);
pokemonRouter.get("/:id/delete", removePokemon);

export default pokemonRouter;
