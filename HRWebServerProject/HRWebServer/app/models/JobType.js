const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var JobTypeSchema = new Schema({
    _id: { type: Number },
    jobTypeName: { type: String, maxlength: 200, required: true },
    dateCreated: { type: Date, default: Date.now },
    jobs: [{ type: Number, ref: 'job' }]
});

JobTypeSchema.plugin(autoIncrement.plugin, { model: 'job_type', field: '_id', startAt: 1 });

module.exports = mongoose.model('job_type', JobTypeSchema);
