import { Router } from "express";
import usersRouter from "./users.mjs"
import productsRouter from "./products.mjs"
import teamsRouter from "./teams.mjs"

const router = Router();

router.use(usersRouter);
router.use(productsRouter);
router.use(teamsRouter);

export default router;