import { Team } from '../mongoose/schema/teams.mjs';
import { validationResult, matchedData } from 'express-validator'; 
import { User } from '../mongoose/schema/user.mjs';

export const createTeamHandler = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);

    const members = data.teamMembers.map(member => member.trim());

    for (const member of members) {
        const user = await User.findById(member);
        if (!user) return res.status(400).send("User not found");
        console.log(`Members id: ${member}`);
    }

    const newTeam = new Team(data);
    try {
        console.log("Creating new team");
        console.log(newTeam);
        const savedTeam = await newTeam.save();
        return res.status(201).send(savedTeam);
    } catch (err) {
        console.log(err);
        return res.status(400).send("An error occurred while creating a team");
    }
}

export const addUserToTeam = (req, res) => {
    
}