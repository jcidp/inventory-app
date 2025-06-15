import { Router } from "express";
import { getTrainer } from "../controllers/trainersController";

const trainersRouter = Router();

trainersRouter.get("/:id", getTrainer);

export default trainersRouter;
