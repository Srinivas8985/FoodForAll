const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const fixNgoData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodforall');
        console.log('Connected to DB');

        const ngos = await User.find({ role: 'ngo' });

        for (const ngo of ngos) {
            let updated = false;
            if (!ngo.address && !ngo.fullAddress) {
                ngo.address = "123 Community Centre, Main Road"; // Default placeholder
                updated = true;
            }
            if (!ngo.city) {
                ngo.city = "Mumbai";
                updated = true;
            }
            if (!ngo.organizationName) {
                ngo.organizationName = ngo.name;
                updated = true;
            }

            if (updated) {
                await ngo.save();
                console.log(`Updated NGO: ${ngo.name}`);
            }
        }

        console.log('NGO Data Fix Complete');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixNgoData();
