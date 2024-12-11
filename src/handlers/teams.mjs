import { Team } from '../mongoose/schema/teams.mjs';
import { validationResult, matchedData } from 'express-validator'; 
import { User } from '../mongoose/schema/user.mjs';

export const createTeamHandler = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);
    const members = data.teamMembers.map(member => member.trim());

    const leader = await User.findById(data.teamLeader);
    if(!leader) {
        return res.status(400).send("Leader not found");
    }

    for (const member of members) {
        const user = await User.findById(member);
        if (!user) {
            return res.status(400).send("User not found");
        }
        console.log(`Members id: ${member}`);
    }

    const newTeam = new Team(data);
    try {
        const savedTeam = await newTeam.save();
    
        for (const member of members) {
            const user = await User.findById(member);
            await User.updateOne({ _id: user }, { $push: { teams: savedTeam._id } })

        }

        return res.status(201).send(savedTeam);
    } catch (err) {
        console.log(err);
        return res.status(400).send("An error occurred while creating a team");
    }
}

export const addUserToTeam = async (req, res) => {
    const { teamId, userId } = req.body;

    const user = await User.findById(userId);
    if(!user) {
        return res.status(400).send("User not found");
    }

    const team = await Team.findById(teamId);
    if(!team){
        return res.status(400).send("Team not found");
    }

    await Team.updateOne({ _id: teamId }, { $push: { teamMembers: userId } });
    await User.updateOne({ _id: userId }, { $push: { teams: teamId } });

    return res.status(200).send("User added to team");
}

export const deleteUserFromTeam = async (req, res) => {
    const { teamId, userId } = req.body;

    const user = await User.findById(userId);
    if(!user) {
        return res.status(400).send("User not found");
    }

    const team = await Team.findById(teamId);
    if(!team){
        return res.status(400).send("Team not found");
    }

    await Team.updateOne( { _id: teamId }, { $pull: { teamMembers: userId }});
    await User.updateOne( { _id: userId }, { $pull: { teams: teamId }});

    return res.status(200).send("User deleted from team");
}