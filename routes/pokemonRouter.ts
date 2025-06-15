import { Router } from "express";
import { getAllPokemon } from "../controllers/pokemonController";

const pokemonRouter = Router();

pokemonRouter.get("/", getAllPokemon);

export default pokemonRouter;
