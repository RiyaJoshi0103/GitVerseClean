
const fs = require("fs").promises;
const path = require("path");


async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(),".GitVerse");
    const stagingPath = path.join(repoPath, "staging");

    try{
        await fs.mkdir(stagingPath, { recursive: true });
        const filename = path.basename(filePath);
        await fs.copyFile(
            filePath,
            path.join(stagingPath, filename)
        );
        console.log(`Files ${filename} added to staging area`);
    }catch(err){
        console.error("Error adding file to staging area:", err);
        return;
    }
}       
module.exports = { addRepo };
