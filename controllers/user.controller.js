import userModel from '../models/user.model.js';
import * as userservices from "../services/user.service.js"; // Correct import for named export
import { validationResult } from "express-validator"; // Import validationResult
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Call createuser function to create the user
        const newUser = await userservices.createuser(req.body);

        // Generate JWT for the created user
        const token = await newUser.generateJWT(); // Assuming `generateJWT` is a method in the user model
        delete newUser._doc.password;
        // Convert the Mongoose document to a plain object and remove sensitive fields
        
        // Respond with the created user and token
        res.status(201).json({ newUser,token });
    } catch (error) {
        // Handle errors (e.g., duplicate email, validation issues)
        res.status(400).json({ error: error.message });
    }
};
export const logincontroller = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const token = await user.generateJWT();
        delete user._doc.password;

        res.status(200).json({ user, token });


    } catch (err) {

        console.log(err);

        res.status(400).send(err.message);
    }
};

export const profilecontroller = async(req,res)=>{

    console.log(req.user);
    res.status(200).json({
        user:req.user
    });
}

export const logoutcontroller = async (req,res)=> {
    try{
        //find which though which we want to logout 
        // token can be found through either header or cookie
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);//ex is exipration is 60x60x24 i.e 24hrs  we have blacklisted this token for 24hrs it is used in security purposes

        res.status(200).json({
            message: 'Logged out successfully'
        });

    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message);

    }
};

export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userservices.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}