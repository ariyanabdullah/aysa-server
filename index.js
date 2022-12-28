require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_Name}:${process.env.USER_PASSWORD}@cluster1.evach3k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("Aysa").collection("allusers");
    const postCollection = client.db("Aysa").collection("post");
    const commentCollection = client.db("Aysa").collection("comments");
    // Post API for All User
    app.post("/allUser", async (req, res) => {
      const userData = req.body;
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    // get a single user by email
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // update a user Data

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;

      const userData = req.body;
      const name = userData.name;
      const address = userData.address;
      const universite = userData.universite;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: name,
          address: address,
          universite: universite,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // user give a Post
    app.post("/allpost", async (req, res) => {
      const postData = req.body;
      const result = await postCollection.insertOne(postData);
      res.send(result);
    });

    // Get All Post
    app.get("/allpost", async (req, res) => {
      const limit = parseInt(req.query.limit);
      const query = {};
      const cursor = postCollection.find(query);
      const result = await cursor.sort({ like: -1 }).limit(limit).toArray();
      res.send(result);
    });

    // get a single Post by id

    app.get("/singlePost/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postCollection.findOne(query);
      res.send(result);
    });

    // Update Like of a post
    app.patch("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const liked = req.body.liked;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          like: liked,
        },
      };
      const option = { upsert: true };
      const result = await postCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    // Post the Comments
    app.post("/allComments", async (req, res) => {
      const commentData = req.body;
      const result = await commentCollection.insertOne(commentData);
      res.send(result);
    });

    // get comment of a post by post id

    app.get("/allcomments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const result = await commentCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

// for testing purpose
app.get("/", (req, res) => {
  res.send("Wellcome to Aysa SErver");
});

app.listen(port, () => {
  console.log("server is running ");
});
