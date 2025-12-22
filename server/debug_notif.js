const mongoose = require('mongoose');
const User = require('./models/User');
const FoodDonation = require('./models/FoodDonation');
const Notification = require('./models/Notification');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const debug = async () => {
    await connectDB();

    console.log('\n--- USERS ---');
    const users = await User.find({});
    users.forEach(u => console.log(`${u.name} (${u.email}) - Role: ${u.role}`));

    console.log('\n--- DONATIONS (Today) ---');
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    console.log('Start of Day:', startOfDay);

    const donations = await FoodDonation.find({ createdAt: { $gte: startOfDay } });
    if (donations.length === 0) console.log('No donations found for today.');
    donations.forEach(d => console.log(`Donation: ${d.foodName}, CreatedAt: ${d.createdAt}, Donor: ${d.donor}`));

    console.log('\n--- NOTIFICATIONS ---');
    const notifs = await Notification.find({}).populate('user', 'name');
    if (notifs.length === 0) console.log('No notifications found.');
    notifs.forEach(n => console.log(`To: ${n.user.name}, Msg: ${n.message}, Read: ${n.isRead}`));

    console.log('\nFinished');
    process.exit();
};

debug();
