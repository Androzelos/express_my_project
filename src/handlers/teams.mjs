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
    }

    data.teamMembers.push(data.teamLeader);
    const newTeam = new Team(data);
    
    try {
        const savedTeam = await newTeam.save();
    
        for (const member of members) {
            const user = await User.findById(member);
            await User.updateOne({ _id: user }, { $push: { teams: savedTeam._id } })

        }

        await User.updateOne({ _id: leader }, { $push: { teams: savedTeam._id } })
        console.log(`Team Created: ${savedTeam}`);

        return res.status(201).send("Team created");
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

    console.log(`User ${userId} added to team ${teamId}`);

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

    console.log(`User ${userId} deleted from team ${teamId}`);

    return res.status(200).send("User deleted from team");
}

export const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.body;

        const team = await Team.findById(teamId);
        if(!team){
            return res.status(400).send("Team not found");
        }

        team.teamMembers.map(async (member) => {
            if(!member) return res.status(400).send("User not found");
            await User.updateOne( { _id: member }, { $pull: { teams: teamId }});
            console.log(`User ${member} deleted from team`);
        });

        await Team.deleteOne({ _id: teamId });

        console.log(`Team deleted: ${team}`);

        return res.status(200).send("Team deleted");
    } catch (error) {
        console.log(error);
        return res.status(400).send("An error occurred while deleting a team");
    }
}