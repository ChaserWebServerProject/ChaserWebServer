const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var provinceSchema = new Schema({
    _id: { type: Number },
    provinceCode: { type: String, maxlength: 6, required: true, unique: true },
    provinceName: { type: String, maxlength: 128, required: true },
    dateCreated: { type: Date, default: Date.now },
    cities: [{ type: Number, ref: 'city' }]
});

provinceSchema.plugin(autoIncrement.plugin, { model: 'province', field: '_id', startAt: 1 });

module.exports = mongoose.model('province', provinceSchema);
