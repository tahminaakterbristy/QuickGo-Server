const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 6077;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nb7zkyq.mongodb.net/?appName=Cluster0`;






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
    // showing service data and route setup
    const serviceCollection = client.db('QuickGoo').collection('services');
    const coverageceCollection = client.db('QuickGoo').collection('coverage');
    const TestimonialCollection = client.db('QuickGoo').collection('Testimonials');


    app.get('/services', async (req, res) => {
      
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
 
     
  });

  app.get('/services/route/:slug', async (req, res) => {
    const slug = `/services/${req.params.slug}`;
    const query = { route: slug };
    const options = { projection: { _id: 0, title: 1, description: 1, icon: 1, route: 1 } };
    const result = await serviceCollection.findOne(query, options);
    res.send(result);
  });

// testimonials
app.get('/testimonials', async (req, res) => {
      
  const cursor = TestimonialCollection.find();
  const result = await cursor.toArray();
  res.send(result);

 
});
  // coverage operation
  app.get("/coverages", async (req, res) => {
    try {
      const coverages = await coverageceCollection.find();
      res.json(coverages);  // Return the data
    } catch (error) {
      console.error("Error fetching coverages:", error);
      res.json([]);  // Return an empty array if error occurs
    }
  });
   


    
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


    // Basic Route to Check if the Server is Running
app.get('/', (req, res) => {
    res.send('Server is running');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  