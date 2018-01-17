const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var notificationSchema = new Schema({
    orderId: {
        type: Number
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    receivers: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    message: {
        type: String,
        default: 'Bạn nhận được một thông báo từ Việc Nhanh.'
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'job'
    },
    readBy: [{
        readerId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
});

notificationSchema.plugin(autoIncrement.plugin, { model: 'notification', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('notification', notificationSchema);
