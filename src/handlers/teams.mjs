import { Team } from '../mongoose/schema/teams.mjs';
import { validationResult, matchedData } from 'express-validator'; 

export const createTeamHandler = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);
    console.log("Data:");
    console.log(data);
    const newTeam = new Team(data);
    try {
        console.log("Creating new team");
        console.log(newTeam);
        const savedTeam = await newTeam.save();
        return res.status(201).send(savedTeam);
    } catch (err) {
        console.log(err.errorResponse);
        return res.sendStatus(400);
    }
}