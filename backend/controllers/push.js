const fs = require("fs").promises;
const path = require("path");
const { s3, s3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".GitVerse");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);
        const params = {
          Bucket: s3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };

        // Upload to S3
        await s3.upload(params).promise();
      }
    }
    console.log("Repository pushed to S3 successfully.");
  } catch (e) {
    console.log("Error pushing repo:", e);
  }
}

module.exports = { pushRepo };
