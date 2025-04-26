const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
    const usersCollection = client.db('QuickGoo').collection('users');
    const parcelCollection = client.db('QuickGoo').collection('parcels');


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
   
// JWT create route
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.send({ token });
});
// Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Unauthorized");

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Forbidden");
    req.user = decoded;
    next();
  });
};


const verifyAdmin = async (req, res, next) => {
  const email = req.user.email; 

  const user = await usersCollection.findOne({ email: email });

  if (user?.role !== "admin") {
    return res.status(403).send({ message: "Forbidden: You are not an admin" });
  }

  next();
};


// Get all users
app.get("/users", async (req, res) => {
  const users = await usersCollection.find().toArray();
  res.send(users);
});
// admin check
app.get("/users/admin/:email", verifyToken, verifyAdmin, async (req, res) => {
  const email = req.params.email;

  const user = await usersCollection.findOne({ email: email });
  const isAdmin = user?.role === "admin";

  res.send({ isAdmin }); 
})
app.post("/users", async (req, res) => {
  const user = req.body;
  const existingUser = await usersCollection.findOne({ email: user.email });

  if (existingUser) {
    return res.send({ message: "User already exists" });
  }

  const result = await usersCollection.insertOne(user);
  res.send(result);
});
// update user as admin
app.patch("/users/admin/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      role: "admin",
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
});
// remove from admin role
app.patch("/users/remove-admin/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: { role: "user" },  
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
});
// delete user
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Get parcels by email
app.get("/parcels", verifyToken, async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const parcels = await parcelCollection.find({ email }).toArray();
  res.send(parcels);
});

// Create a new parcel
app.post("/parcels", verifyToken, async (req, res) => {
  const newParcel = req.body;
  const result = await parcelCollection.insertOne(newParcel);
  res.send({ message: "Parcel created successfully", parcelId: result.insertedId });
});

// Update parcel (for user to edit parcel details)
app.patch("/parcels/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { description, status } = req.body;

  // Update the parcel with the new data
  const result = await parcelCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { description, status } }
  );

  if (result.modifiedCount > 0) {
    const updatedParcel = await parcelCollection.findOne({ _id: new ObjectId(id) });
    res.send(updatedParcel); // Send back the updated parcel data
  } else {
    res.status(400).send({ message: "Failed to update parcel." });
  }
});

// Delete parcel (for admin only)
app.delete("/parcels/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const result = await parcelCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount > 0) {
    res.send({ message: "Parcel deleted successfully." });
  } else {
    res.status(404).send({ message: "Parcel not found" });
  }
});

// Admin route to view all parcels
app.get("/admin/parcels", verifyToken, verifyAdmin, async (req, res) => {
  const parcels = await parcelCollection.find({}).toArray();
  res.send(parcels);
});

// Route to delete a parcel
app.delete("/parcels/:id", async (req, res) => {
  const id = req.params.id;
  const result = await parcelCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Route to approve a parcel (admin only)
app.get("/admin/parcels",  async (req, res) => {
  try {
    const allParcels = await parcelCollection.find().toArray();
    res.send(allParcels);
  } catch (err) {
    console.error("Failed to fetch parcels for admin", err);
    res.status(500).send({ message: "Failed to fetch parcels" });
  }
});
app.patch("/parcels/approve/:id", verifyToken,verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const result = await parcelCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "Approved" } }
  );
  if (result.modifiedCount > 0) {
    res.send({ message: "Parcel approved successfully." });
  } else {
    res.status(400).send({ message: "Failed to approve parcel." });
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
  