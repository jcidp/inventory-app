import { Router } from "express";
import { createTrainer, getTrainer, newTrainer } from "../controllers/trainersController";

const trainersRouter = Router();

trainersRouter.get("/new", newTrainer);
trainersRouter.get("/:id", getTrainer);
trainersRouter.post("/create", createTrainer);
// trainersRouter.put("/:id", updateTrainer);
// trainersRouter.delete("/:id", removeTrainer);

export default trainersRouter;
