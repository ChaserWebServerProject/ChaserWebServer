const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var companySchema = new Schema({
    _id: { type: Number },
    companyName: { type: String, required: true, maxlength: 200 },
    dateCreated: { type: Date, default: Date.now },
    companyExtend: { type: Number, ref: 'company_extend', default: null },
    jobs: [{ type: Number, ref: 'job' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

companySchema.plugin(autoIncrement.plugin, { model: 'company', field: '_id', startAt: 1 });

module.exports = mongoose.model('company', companySchema);
