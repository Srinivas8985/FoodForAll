const express = require('express');
const router = express.Router();
const { donateMoney, getMyMoneyDonations, getAllMoneyDonations, getNgoMoneyDonations, addUsageProof } = require('../controllers/moneyController');
const { protect, authorize } = require('../middleware/auth');

router.post('/donate', protect, authorize('donor'), donateMoney);
router.get('/my', protect, getMyMoneyDonations);
router.get('/ngo', protect, authorize('ngo'), getNgoMoneyDonations);
router.get('/all', protect, authorize('admin'), getAllMoneyDonations);
router.put('/:id/proof', protect, authorize('ngo'), addUsageProof);

module.exports = router;
