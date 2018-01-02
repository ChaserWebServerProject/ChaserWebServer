const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var jobExtendSchema = new Schema({
    // jobId: { type: Number, default: 0 },//job.id
    position: {
        type: String,
        maxlength: 50,
        required: [true, 'Vị trí làm việc không được bỏ trống.']
    },
    deadline: {
        type: Date,
        required: [true, 'Hạn nộp hồ sơ phải được chọn.']
    },
    salary: {
        type: String,
        required: [true, 'Thu nhập không được bỏ trống.'],
        maxlength: 50
    },
    graduation: {
        type: String,
        required: [true, 'Học vấn không được bỏ trống.'],
        maxlength: 400
    },
    workType: {
        type: String,
        required: [true, 'Hình thức công việc không được bỏ trống.'],
        maxlength: 100
    },
    amount: {
        type: Number,
        required: [true, 'Số lượng không được bỏ trống.'],
        min: [1, 'Số lượng ít nhât là 1.']
    },
    genderRequirement: {
        type: String,
        required: [true, 'Yêu cầu giới tính phải được chọn.'],
        enum: ['M', 'F', 'NR']
    },
    job: {
        type: Number,
        ref: 'job',
        required: [true, 'Phải có liên kết giữa thông tin cơ bản và thông tin liên quan.']
    }
});

jobExtendSchema.plugin(autoIncrement.plugin, { model: 'job_extend', field: '_id', startAt: 1 });

module.exports = mongoose.model('job_extend', jobExtendSchema);
