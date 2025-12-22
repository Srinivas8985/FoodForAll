const mongoose = require('mongoose');

// @desc    Check system health (DB connection & Server status)
// @route   GET /api/system/health
// @access  Public
exports.checkHealth = async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

        // Basic check - if we reasoned this far, server is 'up'
        const healthData = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            server: {
                uptime: process.uptime(),
                nodeVersion: process.version
            },
            database: {
                status: dbStatus,
                host: mongoose.connection.host || 'unknown',
                name: mongoose.connection.name || 'unknown'
            }
        };

        if (dbStatus !== 'connected') {
            healthData.status = 'degraded';
            healthData.message = 'Database is not connected';
            return res.status(503).json(healthData);
        }

        res.status(200).json(healthData);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            error: error.message
        });
    }
};
