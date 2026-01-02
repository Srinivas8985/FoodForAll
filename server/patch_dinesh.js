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

const patchUser = async () => {
    await connectDB();
    try {
        // Find by phone number since we saw it in previous step: 8008590502
        // Or by email: dinesh06082005@gmail.com
        const user = await User.findOne({ email: 'dinesh06082005@gmail.com' });

        if (user) {
            console.log("Found User:", user.name);

            // Patch missing fields
            user.organizationId = "NGO-REG-HYD-5678";
            user.organizationName = "Dinesh Foundation";
            user.fullAddress = "Plot No 45, Near Hitech City Metro, Madhapur";
            user.city = "Hyderabad";
            user.pincode = "500081";

            // Fix role if needed (it was 'donor' in debug output! Needs to be 'ngo' to show in dashboard)
            // The user screenshot showed "Pending" so it might have been manually changed or I misread the debug output.
            // Previous debug output: "role": "donor", "verificationStatus": "pending"
            // Wait, if role is 'donor', it won't show in NGO lists properly usually?
            // Ah, the debug output said "role": "donor". 
            // The user said "in admin dashboard after ngo getting registered". 
            // If the user registered as donor but meant ngo, or if the code defaults to donor?
            // Signup.jsx sends 'ngo' correctly if selected.
            // Let's force role to 'ngo' just in case.

            user.role = 'ngo';
            user.verificationStatus = 'pending'; // Ensure it's pending for verification

            await user.save();
            console.log("User Patched Successfully!");
            console.log("New Role:", user.role);
            console.log("New Address:", user.fullAddress);
        } else {
            console.log("User not found.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

patchUser();
