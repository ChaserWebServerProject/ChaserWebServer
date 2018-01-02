const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var citySchema = new Schema({
    _id: { type: Number },
    cityCode: { type: String, maxlength: 6, required: true, unique: true },
    cityName: { type: String, maxlength: 128, required: true },
    province: { type: Number, ref: 'province', required: true },
    dateCreated: { type: Date, default: Date.now },
    jobs: [{ type: Number, ref: 'job' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

citySchema.plugin(autoIncrement.plugin, { model: 'city', field: '_id', startAt: 1 });

module.exports = mongoose.model('city', citySchema);
