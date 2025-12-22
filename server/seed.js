const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const FoodDonation = require('./models/FoodDonation');
const FoodRequest = require('./models/FoodRequest');
const connectDB = require('./config/db');

dotenv.config();

const foods = ['Rice Packets', 'Vegetable Biryani', 'Bread Loaves', 'Canned Beans', 'Fresh Apples', 'Milk Cartons', 'Pasta Dishes', 'Surplus Wedding Feast', 'Sandwiches', 'Fruit Juice'];
const locations = ['Downtown Community Center', 'Westside Park', 'North Hill Shelter', 'City Square', 'Eastern District', 'Central Station', 'University Campus', 'Tech Park Cafeteria'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing old data...');
        await User.deleteMany();
        await FoodDonation.deleteMany();
        await FoodRequest.deleteMany();

        console.log('Creating Users...');
        // Create 1 Admin, 3 Donors, 3 NGOs
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            phone: 'admin-phone',
            address: 'HQ'
        });

        const donors = [];
        for (let i = 1; i <= 3; i++) {
            donors.push(await User.create({
                name: `Donor ${i} - ${['FreshFoods', 'CityBakery', 'HotelGrand'][i - 1] || 'Individual'}`,
                email: `donor${i}@example.com`,
                password: 'password123',
                role: 'donor',
                phone: `9999${i}0000${i}`,
                address: `Location ${i}`
            }));
        }

        const ngos = [];
        for (let i = 1; i <= 3; i++) {
            ngos.push(await User.create({
                name: `NGO ${i} - ${['HelpHands', 'CityFeed', 'FoodBank'][i - 1] || 'Volunteer'}`,
                email: `ngo${i}@example.com`,
                password: 'password123',
                role: 'ngo',
                phone: `8888${i}0000${i}`,
                address: `Shelter ${i}`
            }));
        }

        console.log('Creating Donations...');
        const donations = [];
        for (let i = 0; i < 25; i++) {
            const donor = getRandomElement(donors);
            const status = Math.random() > 0.3 ? 'available' : (Math.random() > 0.5 ? 'assigned' : 'delivered');

            donations.push({
                donor: donor._id,
                foodName: getRandomElement(foods),
                quantity: `${Math.floor(Math.random() * 50) + 10} servings`,
                expiryTime: getRandomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
                pickupLocation: getRandomElement(locations),
                contactPhone: donor.phone,
                message: 'Fresh surplus food, ready for pickup.',
                status: status,
                assignedTo: status !== 'available' ? getRandomElement(ngos)._id : undefined,
                createdAt: getRandomDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), new Date())
            });
        }
        await FoodDonation.create(donations);

        console.log('Creating Requests...');
        const requests = [];
        for (let i = 0; i < 15; i++) {
            const ngo = getRandomElement(ngos);
            const status = Math.random() > 0.4 ? 'active' : 'fulfilled';

            requests.push({
                requester: ngo._id,
                itemsNeeded: getRandomElement(foods),
                quantityNeeded: `${Math.floor(Math.random() * 100) + 20} servings`,
                location: ngo.address,
                urgency: getRandomElement(['low', 'medium', 'high', 'critical']),
                message: 'Needed urgently for local shelter distribution.',
                status: status,
                createdAt: getRandomDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), new Date())
            });
        }
        await FoodRequest.create(requests);

        console.log('Data Overhaul Complete! Database is now rich and vibrant.');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
