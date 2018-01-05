const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var JobTypeSchema = new Schema({
    orderId: {
        type: Number
    },
    jobTypeName: {
        type: String,
        maxlength: 200,
        required: true,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    jobs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'job'
        }
    ]
});

JobTypeSchema.plugin(autoIncrement.plugin, { model: 'job_type', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('job_type', JobTypeSchema);
