const express = require('express');
const {
    getRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest,
    getMyRequests
} = require('../controllers/requestController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getRequests)
    .post(protect, authorize('ngo', 'admin'), createRequest);

router.route('/my').get(protect, getMyRequests);

router.route('/:id')
    .get(protect, getRequest)
    .put(protect, updateRequest)
    .delete(protect, authorize('ngo', 'admin'), deleteRequest);

module.exports = router;
