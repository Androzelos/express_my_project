import { User } from '../mongoose/schema/user.mjs';
import { validationResult, matchedData } from 'express-validator'; 
import { hashPassword } from '../utils/helpers.mjs';

export const createUserHandler = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (err) {
        console.log(err.errorResponse);
        return res.sendStatus(400);
    }
}