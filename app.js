const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./config/config').get(process.env.NODE_ENV);
const User = require('./models/user')
const routes = require('./routes/route.js');
const cors = require('cors');
 
/*require("dotenv").config({
 path: path.join(__dirname, "../.env")
});
 */
const app = express();
 
const PORT = process.env.PORT || 9000;
 
mongoose
 .connect(db.DATABASE)
 .then(() => {
  console.log('Connected to the Database successfully');
 });
 
app.use(express.urlencoded({ extended: false }));
app.use(cors());
 
app.use(async (req, res, next) => {
 if (req.headers["x-access-token"]) {
  const accessToken = req.headers["x-access-token"];
  const { userId, exp } = await jwt.verify(accessToken, db.SECRET);
  // Check if token has expired
  if (exp < Date.now().valueOf() / 1000) { 
   return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
  } 
  res.locals.loggedInUser = await User.findById(userId); next(); 
 } else { 
  next(); 
 } 
});
 
app.use('/', routes); app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})















/*const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/config').get(process.env.NODE_ENV);
const User = require('./models/user');
const {auth} =require('./middlewares/auth');

const app = express();
//app use
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(cookieParser());


//database connection

mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE,{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err) console.log(err);
    else console.log('Database is connected');
})


// adding new user (sign-up route)
app.post('/api/register',function(req,res){
    // taking a user
    const newuser=new User(req.body);
    
   if(newuser.password!=newuser.cpassword)return res.status(400).json({message: "password not match"});
    
    User.findOne({email:newuser.email},function(err,user){
        if(user) return res.status(400).json({ auth : false, message :"email exists"});
 
        newuser.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({ success : false});}
            res.status(200).json({
                succes:true,
                user : doc
            });
        });
    });
 });

 
 // login user
app.post('/api/login', function(req,res){
    let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });
    
        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id
                        ,email : user.email
                    });
                });    
            });
          });
        }
    });
});


// get logged in user
app.get('/api/profile',auth,function(req,res){
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.firstname + req.user.lastname
        
    })
});
// get all users
app.get('/api/users',async function(req,res){
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.send("Error"+err)
    }
    
});

// get specific user
app.get('/api/user/:id',async function(req,res){
    try{
        const users = await User.findById(req.params.id);
        res.json(users);
    }catch(err){
        res.send("Error"+err)
    }
    
});

//delete user

app.delete('/api/user/:id',async function(req,res){
    try{
        const users = await User.findById(req.params.id);
        users.remove();
        res.send(req.params.id+"Deleted");
    }catch(err){
        res.send("Error: "+err );
    }
})

//update user
app.put('/api/user/:id', async function(req,res){
    try{
        const update = req.body;
        const userId = req.params.id;
        await User.findByIdAndUpdate(userId,update);
        const id = await User.findById(userId);
        res.status(200).json({
            data: id,
            message: "User has been updated"
        })

    }catch(err){
        res.send("Error: "+err);
    }
})

//logout user
 app.get('/api/logout',auth,function(req,res){
        req.user.deleteToken(req.token,(err,user)=>{
            if(err) return res.status(400).send(err);
            res.sendStatus(200);
        });

    }); 

app.get('/',function(req,res){
    res.status(200).send("Welcome to Sign login API");
})

const PORT = process.env.PORT || 9000

app.listen(PORT,function(){
    console.log('App is live at '+PORT);
})


*/