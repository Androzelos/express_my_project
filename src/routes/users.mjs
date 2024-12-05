import { response, Router } from "express";
import { checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchema.mjs" 
import { createUserHandler } from "../handlers/users.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";

const router = Router();

router.get('/api/users', (req,res) => {
    return res.status(200).send({msg: "Users Decoy"});
})

router.post('/api/users', checkSchema(createUserValidationSchema), createUserHandler);

router.post('/api/users/login', passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    return res.status(200).send({ msg: "succsesful" });
})

export default router;