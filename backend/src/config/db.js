const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database successfully connected");
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

