const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const JobType = require('../models/JobType');

var JobSchema = new Schema({
    orderId: { type: Number },
    jobName: {
        type: String,
        required: [true, 'Tên công việc không được bỏ trống.'],
        maxlength: 200,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'city',
        required: [true, 'Quận/Huyện phải được chọn.']
    },
    jobType: {
        type: Schema.Types.ObjectId,
        ref: 'job_type',
        required: [true, 'Loại hình công việc phải được chọn.']
    },
    // joinedUsers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Người tạo không được bỏ trống.']
    },
    jobExtend: {
        type: Schema.Types.ObjectId,
        ref: 'job_extend',
        default: null
    },
    markedUsers:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
});

JobSchema.plugin(autoIncrement.plugin, { model: 'job', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('job', JobSchema);

// JobSchema.path('jobType').validate(function (value, respond) {
//     JobType.findOne({ _id: value }, function (err, doc) {
//         if (err || !doc) {
//             respond(false);
//         } else {
//             respond(true);
//         }
//     });

// }, 'Loại hình công việc phải được chọn.');