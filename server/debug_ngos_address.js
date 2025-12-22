const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkNGOs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodforall');
        console.log('Connected to DB');

        const ngos = await User.find({ role: 'ngo' });
        console.log(`Total NGOs found: ${ngos.length}`);

        ngos.forEach(ngo => {
            console.log(`NGO: ${ngo.name}`);
            console.log(` - fullAddress: "${ngo.fullAddress}"`);
            console.log(` - address: "${ngo.address}"`);
            console.log(` - city: "${ngo.city}"`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkNGOs();
