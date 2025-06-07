
const mongoose = require("mongoose");
const Repository = require("../Models/repoModel");
const User = require("../Models/userModel");
const Issue = require("../Models/issueModel");

async function createRepository(req, res) {
  const {
    owner,
    name,
    description,
    visibility = false, // default false means private
    creationType, // "code" or "empty"
    codeFile, // { filename, content }
  } = req.body;

  try {
    if (!owner || !name) {
      return res.status(400).json({
        message: `Missing required fields: ${!owner ? "owner " : ""}${
          !name ? "name" : ""
        }`.trim(),
      });
    }

    const content =
      creationType === "code" && codeFile
        ? [{ filename: codeFile.filename, content: codeFile.content }]
        : [];

    const newRepository = new Repository({
      owner,
      name,
      description,
      visibility: !!visibility, // ensure boolean
      content,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created successfully",
      repositoryId: result._id,
    });
  } catch (err) {
    console.error("Error creating repository:", err.message);
    return res.status(500).send("Internal server error");
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.status(200).json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return res.status(500).send("Internal server error");
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id)
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).send("Repository not found");
    }
    res.status(200).json(repository);
  } catch (err) {
    console.error("Error fetching repository by ID:", err);
    return res.status(500).send("Internal server error");
  }
}

async function fetchRepositoryByName(req, res) {
  const { name: repoName } = req.params;
  try {
    const repository = await Repository.findOne({ name: repoName })
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).send("Repository not found");
    }
    res.status(200).json(repository);
  } catch (err) {
    console.error("Error fetching repository by name:", err);
    return res.status(500).send("Internal server error");
  }
}

async function fetchRepositoryForCurrentUser(req, res) {
  const userId = req.params.userId;
  try {
    const repositories = await Repository.find({ owner: userId })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length === 0) {
      return res.status(404).send("No repositories found for this user");
    }
    res.status(200).json(repositories);
  } catch (err) {
    console.error("Error fetching repositories for current user:", err);
    return res.status(500).send("Internal server error");
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const updatedRepository = await Repository.findById(id)
      .populate("owner")
      .populate("issues");

    if (!updatedRepository) {
      return res.status(404).send("Repository not found");
    }

    // Update fields
    if (content) {
      updatedRepository.content.push(content);
    }
    if (description !== undefined) {
      updatedRepository.description = description;
    }

    const result = await updatedRepository.save();

    res.json({
      message: "Repository updated successfully",
      repository: result,
    });
  } catch (err) {
    console.error("Error updating repository:", err);
    return res.status(500).send("Internal server error");
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).send("Repository not found");
    }
    res.json({
      message: "Repository deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting repository:", err);
    return res.status(500).send("Internal server error");
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id)
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).send("Repository not found");
    }

    repository.visibility = !repository.visibility;
    const result = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully",
      repository: result,
    });
  } catch (err) {
    console.error("Error toggling repository visibility:", err);
    return res.status(500).send("Internal server error");
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
};
