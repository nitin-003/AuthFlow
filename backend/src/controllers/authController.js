const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required!"});
        }

        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000});
        res.status(201).json({ message: "User registered successfully"});
    }
    catch(err){
        res.status(500).json({ message:  err.message });
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try{
        if(!email || !password){
            return res.status(400).json({ message: "Required all fields"});
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000});
        res.status(200).json({ message: "Login Successful"});
    }
    catch(err){
        res.status(500).json({ message:  err.message });
    }
};

module.exports.logout = async (req, res) => {
    try{
        res.clearCookie("token", {httpOnly: true, sameSite: "strict", secure: false });

        return res.status(200).json({ message: "Logged out successfully" })
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}


