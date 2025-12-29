const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports.getUser = async (req, res) => {
  try{
    const user = await User.findById(req.user.id).select("-password");

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateUser = async (req, res) => {
  try{
    const { name, email, password } = req.body;
    const updates = {};

    if(name) updates.name = name;

    if(email){
      const emailExists = await User.findOne({ email });
      if(emailExists && emailExists._id.toString() !== req.user.id){
        return res.status(400).json({ message: "Email already in use" });
      }
      updates.email = email;
    }

    if(password){
      if(password.length < 6){
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    if(Object.keys(updates).length === 0){
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");

    res.status(200).json(user);
  }
   catch(err){
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteUser = async (req, res) => {
  try{
    const user = await User.findByIdAndDelete(req.user.id);

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "Account deleted successfully" });
  }
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try{
    const users = await User.find().select("name email");
    res.status(200).json(users);
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateUserById = async (req, res) => {
  try{
    const { name, email, password } = req.body;
    const updates = {};

    if(name) updates.name = name;

    if(email){
      const emailExists = await User.findOne({ email });
      if(emailExists && emailExists._id.toString() !== req.params.id){
        return res.status(400).json({ message: "Email already in use" });
      }
      updates.email = email;
    }

    if(password){
      if(password.length < 6){
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    if(Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } 
  catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteUserById = async (req, res) => {
  try {
    // prevent deleting self via management route
    if(req.user.id === req.params.id){
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
};


