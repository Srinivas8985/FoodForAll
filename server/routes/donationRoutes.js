const express = require('express');
const {
    getDonations,
    getDonation,
    createDonation,
    updateDonation,
    deleteDonation,
    getMyDonations,
    getPublicDonations,
    getNgoDonations,
    addUsageProof
} = require('../controllers/donationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getPublicDonations);

router.route('/')
    .get(getDonations)
    .post(protect, authorize('donor', 'admin'), createDonation);

router.route('/my').get(protect, getMyDonations);
router.route('/ngo').get(protect, authorize('ngo'), getNgoDonations);

router.route('/:id')
    .get(getDonation)
    .put(protect, updateDonation)
    .delete(protect, authorize('donor', 'admin'), deleteDonation);

router.route('/:id/proof').put(protect, authorize('ngo', 'admin'), addUsageProof);

module.exports = router;
