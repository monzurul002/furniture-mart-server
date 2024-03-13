const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const furnituresCollection = client.db("furnitureMart").collection("allfurnitures")

        //get user specific furniture
        app.get("/furniture", async (req, res) => {
            const category = req.query.category;
            const query = { category }
            const result = await furnituresCollection.find(query).toArray()
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