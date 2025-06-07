const mongoose = require("mongoose");
const Repository = require("../Models/repoModel");
const User = require("../Models/userModel");
const Issue = require("../Models/issueModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;
  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });
    await issue.save();
    res.status(201).json({
      message: "Issue created successfully",
      issue,
    });
  } catch (err) {
    console.error("Error creating issue:", err);
    return res.status(500).send("Internal server error");
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).send("Issue not found");
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;
    await issue.save();

    res.json({
      message: "Issue updated successfully",
      issue,
    });
  } catch (err) {
    console.error("Error during issue update:", err);
    return res.status(500).send("Internal server error");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).send("Issue not found");
    }

    res.json({
      message: "Issue deleted successfully",
    });
  } catch (err) {
    console.error("Error during deletion:", err);
    return res.status(500).send("Internal server error");
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues || issues.length === 0) {
      return res.status(404).send("No issues found");
    }

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching issues:", err);
    return res.status(500).send("Internal server error");
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).send("Issue not found");
    }

    res.json({
      message: "Issue found successfully",
      issue,
    });
  } catch (err) {
    console.error("Error finding issue:", err);
    return res.status(500).send("Internal server error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
