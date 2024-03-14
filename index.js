const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const app = express()
const cors = require('cors')
require("dotenv").config()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {

    res.sendFile('./index.html', { root: __dirname })
})
const uri = "mongodb+srv://furnitureMart:OjUDVvOpZCQSZ4PG@cluster0.rwbunfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        //db collection name
        const furnituresCollection = client.db("furnitureMart").collection("allfurnitures")
        const orderCollection = client.db("furnitureMart").collection("orderCollection")
        const userCollection = client.db("furnitureMart").collection("users")

        //get user specific furniture
        app.get("/furniture", async (req, res) => {
            const { category } = req.query;
            const searchQuery = category.toLowerCase()
            const query = { category: searchQuery }
            const result = await furnituresCollection.find(query).toArray()
            res.send(result)
        })
        // furniture get by id
        app.get("/furniture/:id", async (req, res) => {
            const { id } = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await furnituresCollection.findOne(filter);
            res.send(result);
        })


        //order furniture 
        //post a furniture
        app.post("/orders", async (req, res) => {
            const furnitureInfo = req.body;
            const result = orderCollection.insertOne(furnitureInfo);
            res.send(result);

        })
        // get order collection
        app.get("/orders", async (req, res) => {
            const { email } = req.query;
            const query = { userEmail: email }
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })

        app.put("/orders/:id", async (res, req) => {
            const updatedInfo = req.body;
            const { id } = req.params;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    updatedInfo
                }
            }
            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })
        //  - ------------------------ user collection------------------------------ 
        // post a user
        app.post("/users", async (req, res) => {
            const userInfo = req.body;
            const result = await userCollection.insertOne(userInfo);
            res.send(result)
        })
        app.get("/users", async (req, res) => {
            const result = userCollection.find().toArray();
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("furniture server is ruinng");
})