const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var companyExtendSchema = new Schema({
    // orderId:
    //     {
    //         type: Number
    //     },
    address: {
        type: String,
        maxlength: 400,
        default: '',
        trim: true
    },
    description: {
        type: String,
        maxlength: 4000,
        default: '',
        trim: true
    },
    founded: {
        type: Date,
        default: Date.now
    },
    founder: {
        type: String,
        maxlength: 100,
        default: '',
        trim: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: true
    }
});

// companyExtendSchema.plugin(autoIncrement.plugin, { model: 'company_extend', field: 'orderId', startAt: 1 });

module.exports = mongoose.model('company_extend', companyExtendSchema);
