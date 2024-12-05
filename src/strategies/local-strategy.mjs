import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schema/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id);
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({username});
            if (!findUser) throw new Error("User not found");
            console.log(`Password: ${password} FindUser Password: ${findUser.password}`);
            if (!comparePassword(password, findUser.password)) throw new Error("Password is incorrect");
            done(null, findUser);
        } catch (err) {
            done(err, null);    
        }
    })
)