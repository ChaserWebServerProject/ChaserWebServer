const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var companyExtendSchema = new Schema({
    _id: { type: Number },
    address: { type: String, maxlength: 400, default: '' },
    description: { type: String, maxlength: 4000, default: '' },
    founded: { type: Date, default: Date.now },
    founder: { type: String, maxlength: 100, default: '' },
    company: { type: Number, ref: 'company', required: true, }
});

companyExtendSchema.plugin(autoIncrement.plugin, { model: 'company_extend', field: '_id', startAt: 1 });

module.exports = mongoose.model('company_extend', companyExtendSchema);
