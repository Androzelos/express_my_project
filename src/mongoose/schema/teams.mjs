import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    teamName:{
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    teamLeader:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    teamMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    teamProjects: {
        type: [mongoose.Schema.Types.String],
        required: true
    }
})

export const Team = mongoose.model("Team", TeamSchema);