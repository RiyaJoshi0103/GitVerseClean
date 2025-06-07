const fs = require("fs").promises;
const path = require("path");



async function initRepo(){
    const repoPath = path.resolve(process.cwd(), ".GitVerse");
    const commitsPath = path.resolve(repoPath, "commits");

    try{
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket:process.env.S3_BUCKET })
        );
        console.log("Repository initialized")
    }catch(err){
        console.error("Error initializing repository:", err);
        return;
    }
}
module.exports = {initRepo};        