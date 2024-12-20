import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose, { Mongoose } from 'mongoose';
import passport from 'passport';
import routes from './routes/index.mjs';
import dotenv from 'dotenv';

dotenv.config();

export function createApp() {

    const app = express();
    app.use(express.json());
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: parseInt(process.env.COOKIE_MAX_AGE),
        },
        store: MongoStore.create({
            dbName: 'Express_My_Database',
            client: mongoose.connection.getClient()
        })
    }))
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(routes);

    app.get('/', (req, res) => {
        console.log(req.session);
        return res.status(200).send({ msg: "Welcome to my site" });
    })

    app.get('/api/auth', (req, res) => {
        console.log(req.user);
        return req.user
            ? res.send("User is logged to console for debuging purposes")
            : res.sendStatus(401);
    })

    return app;
}