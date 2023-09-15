const bodyparser = require('body-parser');
const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt')
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose')
const app = express();
const secretKey = 'very-strong-security-key-ehehehehe';
const jwt = require('jsonwebtoken')
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
const userName = encodeURIComponent("amaan5054");
const pass = encodeURIComponent("5ncbX1V33FscpOIW");
const port = 4500;

const url = `mongodb+srv://${userName}:${pass}@cluster0.jjfk95z.mongodb.net/usermanagementapp?retryWrites=true&w=majority`;
const client = new MongoClient(url);
client.connect();
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }); // Add options
mongoose.connection.once('open', () => 
    console.log("Successfully connected to Database!")
    ).on('error', (error) => {
        console.log("Connection Error!", error)
    })
app.listen(port,()=>{
    console.log(`Server running ${port} !`)
})

const userSchema = new mongoose.Schema({
    name : { type:String ,require:true},
    mobile : { type:Number ,require:true, unique: true},
    email : { type:String ,require:true, unique: true},
    password: { type:String ,require:true}
})
const user = mongoose.model('User', userSchema);

//Login Users
app.post('/login', async (req,res)=> {
    const lookEmail = req.body.email;
    const lookPassword = req.body.password;
   // console.log(lookEmail)
    try {
        const user = await client.db('usermanagementapp').collection('users').findOne({email: lookEmail});
      
       const isPasswordValid = await bcrypt.compare(lookPassword, user.password);
        
    if (!isPasswordValid) {
    //   throw new Error('Invalid password');
    const responseData= {
        message:"Incorrect Credentials!"
      }
      res.send(responseData);
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    if(user && isPasswordValid){
        const responseData = {
            userData: user,
            message: "Login Successful!",
            token: token
        };
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json(responseData);
    }else {
        console.log('User not found');
        const responseData= {
          message:"Incorrect Credentials!"
        }
        res.send(responseData);
      }
  } catch (error) {
    const responseData = {
        err: error,
        message: "Authentication failed. Invalid email or password."
    };

    res.status(401).json(responseData);
  }
})

//Registration Users
app.post('/register', async (req, res) => {
    //const { name, lookEmail, lookMobile, password } = req.body;
    const name = req.body.name;
    const lookEmail = req.body.email;
    const lookMobile = req.body.mobile;
    const password = req.body.password;
    try {
      // Check if a user with the same username already exists
      const existingEmail = await client.db('usermanagementapp').collection('users').findOne({email: lookEmail});
      const existingMobile = await client.db('usermanagementapp').collection('users').findOne({mobile: lookMobile});
      if (existingEmail) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      if (existingMobile) {
        return res.status(400).json({ message: 'User with this mobile already exists' });
      }
  
      // Create a new user with the hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new user({
        name,
        mobile: lookMobile,
        password: hashedPassword,
        email: lookEmail
      });
  
      // Save the new user
      const savedUser = await newUser.save();
  
      res.status(201).json(savedUser);
      console.log('User Posted Successfully');
    } catch (error) {
      console.error(error);
      const responseData = {
        err: error,
        message: "Authentication failed. Invalid email or password."
    };

    res.status(401).json(responseData);
    }
  });

// GET ALL API's
app.get('/allUsers',async(req,res)=>{
    try {
    const data = await client.db('usermanagementapp').collection('users').find({}).toArray();
    res.send({
        data: data,
        message: "Users data fetched!"
    })
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

// GET ONE USER
app.get('/users/:email',  async(req,res) => {
    try{
        const user = await client.db('usermanagementapp').collection('users').findOne({email: req.params.email});

        if(user){
            res.status(200).json({
                data: user,
                message: "Users data fetched!"
            })
        } else {
            res.status(200).json({
                message: "User doesn't exist"
            })
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

// Update User API
app.put('/userUpdate/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const updatedMobile = req.body.mobile;
    console.log(userId)
    try {
      // Find the note by ID and update it
      const updatedUser = await user.findByIdAndUpdate(userId, {
        name: updatedName,
        email: updatedEmail,
        mobile: updatedMobile
      }, { new: true }); // { new: true } returns the updated note
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  //DELETE user API
app.delete('/userDelete/:id', async(req,res)=>{
    const UserId = req.params.id;
    console.log(UserId)
    try {
      // Delete the note by ID
      const deleteUser = await user.findByIdAndDelete(UserId);
  
      if (!deleteUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })