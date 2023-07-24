const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6pylfvj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("unieducareDB").collection("users");
    const collegesCollection = client.db("unieducareDB").collection("colleges");
    const admissionCollection = client
      .db("unieducareDB")
      .collection("admission");
    const researchCollection = client.db("unieducareDB").collection("research");
    const reviewsCollection = client.db("unieducareDB").collection("reviews");

    app.get("/colleges", async (req, res) => {
      const result = await collegesCollection.find().toArray();
      res.send(result);
    });

    app.get("/research", async (req, res) => {
      const result = await researchCollection.find().toArray();
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    app.get("/colleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const college = await collegesCollection.findOne(query);
      res.send(college);
    });

    app.get("/mycollege/:email", async (req, res) => {
      let query = { email: req.params.email };
      const result = await admissionCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      let query = { email: req.params.email };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/admission", async (req, res) => {
      const newForm = req.body;
      // console.log(newForm);
      const result = await admissionCollection.insertOne(newForm);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Unieducare is running");
});

app.listen(port, () => {
  console.log(`Unieducare is running on port ${port}`);
});
