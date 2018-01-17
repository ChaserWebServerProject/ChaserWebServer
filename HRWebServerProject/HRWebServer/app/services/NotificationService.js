const Notification = require('../models/Notification');

const getAllNotifications = () => {
    return Notification.find();
}

const getNotificationByUserId = (id) => {
    return Notification.find({ receivers: id });
}

const readNotification = (req) => {
    const userId = req.body.userId;
    const notiId = req.params.id;
    const data = {
        readerId: userId,
        readAt: new Date()
    }
    return new Promise((resolve, reject) => {
        Notification.findOne({ _id: notiId, readBy: { $elemMatch: { 'readerId': userId } } })
            .then(noti => {
                if (noti) {
                    return resolve(true);
                } else {
                    Notification.findByIdAndUpdate(notiId, { $push: { 'readBy': data } })
                        .then(() => resolve(true))
                        .catch(err => reject(err));
                }
            })
            .catch(err => reject(err));
    });
}

module.exports = {
    getAllNotifications, getNotificationByUserId, readNotification
}