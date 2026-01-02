const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const count = await User.countDocuments();
        console.log(`Total Users in DB: ${count}`);

        // List the last created user to verify
        const lastUser = await User.findOne().sort({ createdAt: -1 });
        if (lastUser) {
            console.log(`Last Created User: ${lastUser.email} at ${lastUser.createdAt}`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
