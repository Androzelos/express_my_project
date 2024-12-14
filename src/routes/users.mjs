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
    console.log(`User logged in: ${req.user.username} ${req.user._id}`);
    return res.status(200).send({ msg: "Login succsesful" });
})

router.get('/api/users/logout', isAuthed, (req, res) => {
    const _username = req.user.username;
    const _id_ = req.user._id
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        console.log(`User logged out: ${_username} ${_id_}`);
        return res.status(200).send({ msg: "Logged Out" });
    });
})

router.pos

router.get('/api/users/me', (req, res) => {
    console.log(req.sessionID);
    return res.status(200).send(req.user);
})

export default router;