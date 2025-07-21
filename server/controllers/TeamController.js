import Employee from "../models/Employee.js";
import Team from "../models/Team.js";
import { logHistory } from "./employeeHistoryController.js";

export const createTeam = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admins or HR can create teams" });
    }

    const team = await Team.create(req.body);

    for (const memberId of team.members) {
      await Employee.findByIdAndUpdate(memberId, { team: team._id });
    }

    if (team.teamLead && !team.members.includes(team.teamLead)) {
      await Employee.findByIdAndUpdate(team.teamLead, { team: team._id });
    }

    await logHistory(null, "team_creation", req.user.userId, `Team '${team.name}' created`, {
      teamId: team._id,
      teamName: team.name,
    });

    res.status(200).json({ message: "Team created successfully", team });
  } catch (err) {
    res.status(500).json({ message: "Error in creating the team", error: err.message });
  }
};


export const getTeams = async (req,res) => {
    try{
        if(!["admin","hr"].includes(req.user.role)){
            return res.status(403).json({message:"Only Admins or hr can see all the teams"})
        }
        const teams = await Team.find().populate("teamLead", "name designation").populate("members", "name designation");
        res.status(200).json({message:"Teams fetched", teams})
    }catch(err){
        res.status(500).json({message:"Error in fetching the teams",error: err.message});
    }
};

export const updateTeam = async (req,res) => {
    try{
        if(!["admin","hr"].includes(req.user.role)){
            return res.status(403).json({message:"Only Admins or hr can make changes to the team"})
        }
        const {id}=req.params;
        const updated = await Team.findByIdAndUpdate(id, req.body, {new:true});
        if(!updated){
            return res.status(404).json({message:"Team not found"});
        }
        res.status(200).json({message:"Team updated successfully", updated});
    }catch(err){
        res.status(500).json({message:"Error in updating teams", error: err.message});
    }
};

export const deleteTeam = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admins or HR can delete teams" });
    }

    const { id } = req.params;

    // Check if team exists
    const deleted = await Team.findById(id);
    if (!deleted) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Remove the team ID from all employees who have it
    await Employee.updateMany(
      { team: id },
      { $pull: { team: id } }
    );

    // Now delete the team
    await Team.findByIdAndDelete(id);

    // Log the deletion
    await logHistory(null, "team_deletion", req.user.userId, `Team '${deleted.name}' deleted`, {
      teamId: deleted._id,
      teamName: deleted.name,
    });

    res.status(200).json({ message: "Team deleted successfully", deleted });

  } catch (err) {
    console.error("Error deleting team:", err);
    res.status(500).json({ message: "Error in deleting the team", error: err.message });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const userId = req.user.userId;

    const employee = await Employee.findOne({ userRef: userId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const teams = await Team.find({ members: employee._id })
      .populate("teamLead", "name designation")
      .populate("members", "name designation");

    if (teams.length === 0) {
      return res.status(200).json({ message: "You are not part of any team", teams: [] });
    }

    res.status(200).json({ message: "Team(s) fetched successfully", teams });
  } catch (err) {
    res.status(500).json({ message: "Error fetching team(s)", error: err.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    if(!["admin","hr"].includes(req.user.role)){
        return res.status(403).json({message:"Only Admins or hr can only create Team"})
    }

    const team = await Team.findById(id)
      .populate("teamLead", "name designation")
      .populate("members", "name designation");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({ message: "Team fetched", team });
  } catch (err) {
    res.status(500).json({ message: "Error fetching team", error: err.message });
  }
};

