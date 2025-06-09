const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { pushRepo } = require("./controllers/push");
const { commitRepo } = require("./controllers/commit");
const { revertRepo } = require("./controllers/revert");
const { pullRepo } = require("./controllers/pull");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)
  .command("init", "Initialize new command", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add in staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push the changes to s3", {}, pushRepo)
  .command("pull", "Pull the changes from remote repository", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // ✅ Enable CORS before routes
  app.use(
    cors({
      origin: "http://localhost:5173", // Or update with Ingress domain if needed
      credentials: true,
    })
  );

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGO_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) => console.log("❌ Unable to connect to MongoDB", err));

  app.use("/", mainRouter);

  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
      user = userId;
      console.log("===");
      console.log(user);
      console.log("===");
      socket.join(userId);
    });
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("✅ CRUD operations initialized.");
  });

  // ✅ Critical fix: Bind to 0.0.0.0 to make it accessible from outside the pod
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
