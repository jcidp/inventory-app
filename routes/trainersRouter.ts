import { Router } from "express";
import { createTrainer, editTrainer, getTrainer, newTrainer, updateTrainer } from "../controllers/trainersController";

const trainersRouter = Router();

trainersRouter.get("/new", newTrainer);
trainersRouter.get("/:id", getTrainer);
trainersRouter.get("/:id/edit", editTrainer);
trainersRouter.post("/create", createTrainer);
trainersRouter.post("/:id/update", updateTrainer);
// trainersRouter.delete("/:id", removeTrainer);

export default trainersRouter;
