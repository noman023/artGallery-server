const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://assignment10-4026e.web.app"],
    credentials: true,
  })
);
app.use(express.json());

// mongodb atlas connection uri
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@cluster0.faeme9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("artGallery");

    const items = database.collection("items");

    app.get("/items", async (req, res) => {
      const itemsCollection = items.find();
      const result = await itemsCollection.toArray();

      res.send(result);
    });

    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await items.findOne(query);

      res.send(result);
    });

    app.post("/items", async (req, res) => {
      const item = req.body;
      item.createdAt = new Date();
      const result = await items.insertOne(item);

      res.send(result);
    });

    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;

      const {
        itemImg,
        itemName,
        category,
        description,
        price,
        rating,
        customization,
        processing_time,
        stockStatus,
        name,
        email,
      } = item;

      const filter = { _id: new ObjectId(id) };
      /* Set the upsert option to insert a document if no documents match
      the filter */
      const options = { upsert: true };

      const updateItem = {
        $set: {
          itemImg,
          itemName,
          category,
          description,
          price,
          rating,
          customization,
          processing_time,
          stockStatus,
          name,
          email,
        },
      };

      const result = await items.updateOne(filter, updateItem, options);
      res.send(result);
    });

    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await items.deleteOne(query);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
