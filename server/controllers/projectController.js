import Project from "../models/Project.js";
import Team from "../models/Team.js";
import { logHistory } from "./employeeHistoryController.js";
import Employee from "../models/Employee.js";

export const createProject = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can assign projects" });
    }

    const { name, description, startDate, deadline, assignedTeam } = req.body;

    const team = await Team.findById(assignedTeam).populate("members");
    if (!team) {
      return res.status(404).json({ message: "Assigned team not found" });
    }

    const project = await Project.create({
      name,
      description,
      startDate,
      deadline,
      assignedTeam,
      createdBy: req.user.userId
    });

    await Team.findByIdAndUpdate(
      assignedTeam,
      { $addToSet: { projects: project._id } }
    );

    for (const emp of team.members) {
      await Employee.findByIdAndUpdate(
        emp._id,
        { $addToSet: { projects: project._id } },
        { new: true }
      );

      await logHistory(
        emp._id,
        "project_assigned",
        req.user.userId,
        `Assigned to project: ${name}`,
        {
          projectId: project._id,
          projectName: name,
          teamId: assignedTeam,
        }
      );
    }

    res.status(201).json({ message: "Project created and assigned", project });

  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Error creating project", error: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const user = req.user;

    if (["admin", "hr"].includes(user.role)) {
      const projects = await Project.find()
        .populate("assignedTeam", "name")
        .populate("createdBy", "name role");
      return res.status(200).json({ message: "All projects", projects });
    }

    const employee = await Employee.findOne({ userRef: user.userId }).populate("team");
    if (!employee || !employee.team) {
      return res.status(404).json({ message: "Employee or team not found" });
    }

    const projects = await Project.find({ assignedTeam: employee.team._id })
      .populate("assignedTeam", "name");

    res.status(200).json({ message: "Projects assigned to your team", projects });

  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can update project status" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["ongoing", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await Project.findByIdAndUpdate(id, { status }, { new: true });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project status updated", project });
    await logHistory(null, "project_status_update", req.user.userId, `Project '${project.name}' marked as ${status}`, {
      projectId: project._id,
      status
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

export const getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can view filtered projects" });
    }

    if (!["ongoing", "completed"].includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status. Must be 'ongoing' or 'completed'" });
    }

    const projects = await Project.find({ status: status.toLowerCase() })
      .populate("assignedTeam", "name")
      .populate("createdBy", "name role");

    res.status(200).json({ message: `All ${status} projects`, projects });
  } catch (err) {
    res.status(500).json({ message: "Error filtering projects", error: err.message });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.query;

    // Find employee based on logged-in user's reference
    const employee = await Employee.findOne({ userRef: user.userId }).populate("team");

    if (!employee || !employee.team || employee.team.length === 0) {
      return res.status(404).json({ message: "Employee or teams not found" });
    }

    // Collect all team IDs
    const teamIds = employee.team.map(t => t._id);

    // Build project query
    const query = { assignedTeam: { $in: teamIds } };

    if (status) {
      const lowerStatus = status.toLowerCase();
      if (!["ongoing", "completed"].includes(lowerStatus)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      query.status = lowerStatus;
    }

    const projects = await Project.find(query).populate("assignedTeam", "name");

    return res.status(200).json({
      message: `Projects for your team${status ? ` with status '${status}'` : ""}`,
      projects,
    });
  } catch (err) {
    console.error("Error fetching my projects:", err);
    return res.status(500).json({
      message: "Error fetching your projects",
      error: err.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admin or HR can delete projects" });
    }

    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const teamId = project.assignedTeam;

    await Team.updateOne(
      { _id: teamId },
      { $pull: { projects: id } }
    );

    await Employee.updateMany(
      { projects: id },
      { $pull: { projects: id } }
    );

    await Project.findByIdAndDelete(id);

    await logHistory(null, "project_deletion", req.user.userId, `Project '${project.name}' deleted`, {
      projectId: id,
      teamId: teamId
    });

    res.status(200).json({ message: "Project deleted successfully" });

  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Error deleting project", error: err.message });
  }
};

export const getOngoingProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: { $ne: "completed" } }).populate("assignedTeam", "name");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active projects" });
  }
};