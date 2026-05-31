const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register =  async(req, res)=>{
    try{
        const {name, email, password} = req.body;

        const existinguser = await UserModel.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            message:"User registered successfully"
        });

    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}


const login =  async(req,res)=>{
    try{
        const {email, password} = req.body;

        const user = await UserMode.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const token = jwt.sign({id: user._id, role: user.role},
            process.env.JWT_SECRET, {expiresIn:"1h"});

        res.status(200).json({
            token,
            message:"Login successful",
            user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
        });
    } catch(error){
        return res.status(500).json({message:"Internal server error"});
    }

}

module.exports = {register, login};

