const express = require('express');
const router = express.Router();

const {
    getNotificationByUserId, readNotification
} = require('../services/NotificationService');

/* GET NOTIFICATION BY USER ID */
router.get('/notification/get_notification_by_user_id/:id', function (req, res, next) {
    getNotificationByUserId(req.params.id)
        .sort({ 'createdDate': 'desc' })
        .exec()
        .then(notifications => res.json(notifications))
        .catch(err => res.json(err));
});

/* UPDATE READ NOTIFICATION */
router.put('/notification/read_notification/:id', function (req, res, next) {
    readNotification(req)
        .then(result => res.json({ success: result }))
        .catch(err => res.json({ success: false, err: err }));
});

module.exports = router;