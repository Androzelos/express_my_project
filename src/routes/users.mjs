import { response, Router } from "express";
import { checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchema.mjs" 
import { createUserHandler, forgotPasswordHandler } from "../handlers/users.mjs";
import { isAuthed } from "../utils/helpers.mjs";
import { isNotAuthed } from "../utils/helpers.mjs";
import { User } from "../mongoose/schema/user.mjs";
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

router.post('/api/users/forgotPassword', isNotAuthed, forgotPasswordHandler);
router.get('/api/users/forgotPassword', isNotAuthed, async (req, res) => {
    const { query: { token } } = req;
    const user = await User.findOne({ resetPasswordToken: token });

    console.log(user);
    console.log(token);

    console.log(`User ${user._id} requests password reset`);
    if(!user) return res.status(401).send({ msg: "Token does not exist or expired." });

    return res.status(200).send({ msg: "Password reset successful" });
});

export default router;