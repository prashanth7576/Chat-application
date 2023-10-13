const User = require('../models/userModel');
const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/authMiddleware');

// user registration 

router.post('/register', async(req, res) => {
    try {
// chack if user already exists
        const user= await User.findOne({
           email: req.body.email
        });

        if(user) {
            return res.send({
                success: false,
                message: " User already exists"
            })
        }
        
        //create new user

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: "User created successfully",
        });


        
    } catch (error) {
        
        res.send({
            message: error.message,
            success: false,
        });
    }
});

// user login 

router.post('/login', async(req,res) => {

    try {
        // checking  if user exists
        const user= await User.findOne({
            email: req.body.email
         });
 
         if(!user) {
             return res.send({
                 success: false,
                 message: " User does not exist"
             })
         }

         //checking if passwrod is correct

         const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
         );

         if(!validPassword) {
            return res.send({
                success: false,
                message: " Invalid password "
            });
        }
        
        // creating and assigning token

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.send({
            success: true,
            message:"User logged in successfully",
            data: token 
        });

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

// get current user

router.get("/get-current-user", authMiddleware, async (req, res) => {
    
    try {

        const user = await User.findOne({_id: req.body.userId});
        res.send({
            success: true,
            message: " user fetched successfully",
            data: user,
        });
        
    } catch (error) {
        
        res.send({
            success:false,
            message: error.message,
        });
    }
});


// get all users expect current user

router.get("/get-all-users", authMiddleware, async (req, res) => {
    
    try {

        const allUsers = await User.find({_id: {$ne : req.body.userId}});
        res.send({
            success: true,
            message: " users fetched successfully",
            data: allUsers,
        });
        
    } catch (error) {
        
        res.send({
            success:false,
            message: error.message,
        });
    }
});

module.exports = router;