import { Router } from "express";
import { createTeamHandler, addUserToTeam, deleteUserFromTeam } from "../handlers/teams.mjs";
import { isAuthed } from "../utils/helpers.mjs";
import { createTeamValidationSchema } from "../utils/validationSchema.mjs";
import { checkSchema } from "express-validator";

const router = Router();

router.post("/api/teams", isAuthed, checkSchema(createTeamValidationSchema), createTeamHandler);
router.post("/api/teams/addUserToTeam", isAuthed, addUserToTeam);
router.post("/api/teams/deleteUserFromTeam", isAuthed, deleteUserFromTeam);

export default router;