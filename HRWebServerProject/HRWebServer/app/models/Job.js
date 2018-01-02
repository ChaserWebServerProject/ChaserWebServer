const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var JobSchema = new Schema({
    _id: { type: Number },
    jobName: {
        type: String,
        required: [true, 'Tên công việc không được bỏ trống.'],
        maxlength: 200
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    view: {
        type: Number,
        default: 0
    },
    company: {
        type: Number,
        ref: 'company',
        required: [true, 'Công ty phải được chọn']
    },
    city: {
        type: Number,
        ref: 'city',
        required: [true, 'Quận/Huyện phải được chọn.']
    },
    jobType: {
        type: Number,
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
        type: Number,
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

JobSchema.plugin(autoIncrement.plugin, { model: 'job', field: '_id', startAt: 1 });

module.exports = mongoose.model('job', JobSchema);
