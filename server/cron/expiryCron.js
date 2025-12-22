const cron = require('node-cron');
const FoodDonation = require('../models/FoodDonation');

const checkExpiry = () => {
    // Run every hour: '0 * * * *'
    cron.schedule('0 * * * *', async () => {
        console.log('Running Expiry Check Cron Job...');
        try {
            const now = new Date();

            // Find donations that are available/assigned but past their expiry time
            const expiredDonations = await FoodDonation.updateMany(
                {
                    expiryTime: { $lt: now },
                    status: { $in: ['available', 'assigned'] }
                },
                {
                    $set: { status: 'expired' }
                }
            );

            if (expiredDonations.modifiedCount > 0) {
                console.log(`Updated ${expiredDonations.modifiedCount} expired donations.`);
            } else {
                console.log('No expired donations found.');
            }
        } catch (error) {
            console.error('Error running expiry cron job:', error);
        }
    });
};

module.exports = checkExpiry;
