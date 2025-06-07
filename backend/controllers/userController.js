const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;
dotenv.config();

const uri = process.env.MONGO_URI;
let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true, // ✅ fixed typo here
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}

async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    await connectClient();
    const db = client.db("gitverse");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [], // fixed from startRepos to starRepos if that was a typo, otherwise ignore
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { userId: result.insertedId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: result.insertedId });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).send("Internal server error");
  }
}

async function login  (req, res){
 const{ email, password } = req.body;
 try{
   await connectClient ();
    const db = client.db("gitverse");
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).send("invalid credentials");
    }   

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("invalid credentials");
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:"1h"});
    res.json({ token ,userId: user._id}); 
 } catch(error) {
   console.error("Error logging in user:", error);
   return res.status(500).send("Internal server error");
 }
}

async function getAllUsers  (req, res) {
  try{
    await connectClient ();
     const db = client.db("gitverse");
     const usersCollection = db.collection("users");

     const users = await usersCollection.find({ }).toArray();
     res.json(users);
  }catch(error) {
    console.error("Error fetching users:", error);
    return res.status(500).send("Internal server error");
  }
};


async function getUserProfile  (req, res) {
 const currentId =  req.params.id;

 try{
  await connectClient();
  const db = client.db("gitverse");
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({
    _id: new ObjectId(currentId)
  });
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.send(user);
 }catch(err){
  console.error("Error fetching user profile:", err);
  return res.status(500).send("Internal server error");   
 }
  
  
};

async function updateUserProfile(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and new password are required");
  }

  try {
    await connectClient();
    const db = client.db("gitverse");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).send("User with given email not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await usersCollection.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { returnDocument: "after" }
    );

    res.send("Password updated successfully");
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res.status(500).send("Internal server error");
  }
}


async function deleteUserProfile (req, res){
  const currentId = req.params.id;

  try{
    await connectClient();
    const db = client.db("gitverse");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ _id: new ObjectId(currentId) });

    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user profile:", err);
    return res.status(500).send("Internal server error");
  } 
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
