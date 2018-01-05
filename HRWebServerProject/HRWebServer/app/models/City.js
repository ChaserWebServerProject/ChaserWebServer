const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var citySchema = new Schema({
    orderId: { type: Number },
    cityCode: {
        type: String,
        maxlength: 6,
        required: true,
        unique: true,
        trim: true
    },
    cityName: {
        type: String,
        maxlength: 128,
        required: true,
        trim: true
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'province',
        required: true
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
    ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
});

citySchema.plugin(autoIncrement.plugin, { model: 'city', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('city', citySchema);
