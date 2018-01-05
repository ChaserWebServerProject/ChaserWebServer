const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var provinceSchema = new Schema({
    orderId: {
        type: Number
    },
    provinceCode: {
        type: String,
        maxlength: 6,
        required: true,
        unique: true,
        trim: true
    },
    provinceName: {
        type: String,
        maxlength: 128,
        required: true,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    cities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'city'
        }
    ]
});

provinceSchema.plugin(autoIncrement.plugin, { model: 'province', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('province', provinceSchema);
