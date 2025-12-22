const mongoose = require('mongoose');
const User = require('./server/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const checkNGOs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const ngos = await User.find({ role: 'ngo' });
        console.log(`Found ${ngos.length} NGOs:`);
        ngos.forEach(ngo => {
            console.log(`- ${ngo.organizationName || ngo.name} (ID: ${ngo._id})`);
            console.log(`  Status: ${ngo.verificationStatus}`);
            console.log(`  IsActive: ${ngo.isActive}`);
            console.log(`  Phone: ${ngo.phone}`);
            console.log('---');
        });

        const verified = await User.find({
            role: 'ngo',
            verificationStatus: 'approved',
            isActive: true
        });
        console.log(`\nQUERY MATCH CHECK: Found ${verified.length} NGOs that match the 'verified' criteria.`);

        mongoose.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkNGOs();
