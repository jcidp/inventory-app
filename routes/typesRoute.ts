import { Router } from "express";
import { getType, getTypes } from "../controllers/typesController";

const typesRouter = Router();

typesRouter.get("/", getTypes);
typesRouter.get("/:id", getType);

export default typesRouter;
