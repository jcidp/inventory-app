import { getTrainers } from "../controllers/trainersController";
import pokemonRouter from "./pokemonRouter";
import trainersRouter from "./trainersRouter"
import typesRouter from "./typesRoute";

const mountRoutes = (app) => {
  app.use("/trainers", trainersRouter);
  app.use("/pokemon", pokemonRouter);
  app.use("/types", typesRouter);
  app.use("/", getTrainers);
}

export default mountRoutes;
