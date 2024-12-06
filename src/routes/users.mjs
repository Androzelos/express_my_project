import { response, Router } from "express";
import { checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchema.mjs" 
import { createUserHandler } from "../handlers/users.mjs";
import { isAuthed } from "../utils/helpers.mjs";
import { isNotAuthed } from "../utils/helpers.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";

const router = Router();

router.get('/api/users', (req,res) => {
    return res.status(200).send({msg: "Users Decoy"});
})

router.post('/api/users', checkSchema(createUserValidationSchema), createUserHandler);

router.post('/api/users/login', isNotAuthed, passport.authenticate('local'), (req, res) => {
    console.log(`User: ${req.user}`);
    console.log(req.sessionID);
    return res.status(200).send({ msg: "succsesful" });
})

router.get('/api/users/logout', isAuthed, (req, res) => {
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        return res.status(200).send({ msg: "Logged Out" });
    });
})

router.get('/api/users/me', (req, res) => {
    console.log(req.sessionID);
    return res.status(200).send(req.user);
})

export default router;