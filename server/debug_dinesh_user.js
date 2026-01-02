const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const checkUser = async () => {
    await connectDB();
    try {
        const user = await User.findOne({
            $or: [{ name: /Dinesh/i }, { organizationName: /Dinesh/i }]
        });

        if (user) {
            console.log("--- FOUND USER ---");
            console.log(JSON.stringify(user.toObject(), null, 2));
            console.log("------------------");
            console.log("Fields Check:");
            console.log("phone:", user.phone);
            console.log("address:", user.address);
            console.log("fullAddress:", user.fullAddress);
            console.log("city:", user.city);
            console.log("pincode:", user.pincode);
            console.log("organizationId:", user.organizationId);
        } else {
            console.log("User 'Dinesh' not found.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

checkUser();
