import { Router } from "express";
import { createTeamHandler } from "../handlers/teams.mjs";
import { isAuthed } from "../utils/helpers.mjs";
import { createTeamValidationSchema } from "../utils/validationSchema.mjs";
import { checkSchema } from "express-validator";

const router = Router();

router.post("/api/teams", isAuthed, checkSchema(createTeamValidationSchema), createTeamHandler);

export default router;